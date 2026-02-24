import Papa from 'papaparse';

/**
 * Load and parse CSV data
 * @param {string} url - Path to CSV file
 * @returns {Promise<Object>} Parsed and aggregated data
 */
export async function loadAndParseData(url = './data.csv') {
  try {
    const resolvedUrl = url === './data.csv'
      ? `${import.meta.env.BASE_URL}data.csv`
      : url;
    const response = await fetch(resolvedUrl);
    if (!response.ok) {
      throw new Error(`Fehler beim Laden der CSV-Datei: HTTP ${response.status}`);
    }
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        delimiter: ';',
        complete: (results) => {
          const aggregated = aggregateData(results.data);
          resolve(aggregated);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading CSV:', error);
    throw error;
  }
}

/**
 * Aggregate raw CSV data into visualization-ready format
 * @param {Array} rawData - Parsed CSV rows
 * @returns {Object} Aggregated data for all sections
 */
function aggregateData(rawData) {
  return {
    teilA: aggregateLikertData(
      rawData,
      ['frage_a1', 'frage_a2', 'frage_a3', 'frage_a4', 'frage_a5', 'frage_a6', 'frage_a7'],
      { min: 1, max: 5 }
    ),
    teilB: aggregateMultipleChoice(rawData, ['frage_b1', 'frage_b2', 'frage_b3', 'frage_b4', 'frage_b5', 'frage_b6', 'frage_b7', 'frage_b8', 'frage_b9']),
    // frage_c3 wird ÜBERSPRUNGEN — das ist Freitext, wird separat gesammelt
    teilC: aggregateMultipleChoice(rawData, ['frage_c1', 'frage_c2', 'frage_c4', 'frage_c5', 'frage_c6', 'frage_c7']),
    faltstrategieTexte: rawData
      .map(row => ({
        text: String(row.frage_c3 || '').replace(/^[„""]|["""]$/g, '').trim(),
        zugehoerigkeit: row.zugehoerigkeit,
        name: row.name,
        alter: row.alter,
        faltStrategie: row.frage_c2  // 0–3, maps to Faltstrategie option
      }))
      .filter(item => item.text),
    abschiebsbriefe: rawData
      .map(row => ({ text: row.abschiedsbrief, zugehoerigkeit: row.zugehoerigkeit, name: row.name, alter: row.alter }))
      .filter(item => item.text),
    zeichnungen: rawData.map(row => ({ datei: row.zeichnung_datei, name: row.name, alter: row.alter })).filter(item => item.datei),
    teilD3: rawData
      .map(row => ({ value: row.frage_d3, zugehoerigkeit: row.zugehoerigkeit }))
      .filter(item => item.value !== null && item.value !== undefined && item.value !== ''),
    teilE: {
      singleChoice: aggregateMultipleChoice(rawData, ['frage_e1', 'frage_e2', 'frage_e3']),
      likert3: aggregateLikertData(
        rawData,
        ['frage_e4_1', 'frage_e4_2', 'frage_e4_3'],
        { min: 0, max: 2 }
      )
    },
    teilnehmerAnzahl: rawData.length,
    rawRows: rawData,
  };
}

/**
 * Filter raw rows by zugehoerigkeit and re-aggregate.
 * @param {Array} rawRows - All raw CSV rows
 * @param {string} zugehoerigkeit - 'alle' | 'patienten' | 'personal'
 * @returns {Object} Aggregated data object (same shape as loadAndParseData result)
 */
export function filterAndAggregate(rawRows, zugehoerigkeit) {
  if (!rawRows) return aggregateData([]);
  const filtered = zugehoerigkeit === 'alle'
    ? rawRows
    : rawRows.filter(row => (row.zugehoerigkeit || '').toLowerCase() === zugehoerigkeit.toLowerCase());
  return aggregateData(filtered);
}

/**
 * Calculate median and mean for Likert scale questions
 * @param {Array} rawData - CSV rows
 * @param {Array} questionKeys - Column names for Likert questions
 * @param {Object} options - { min, max } scale boundaries
 * @returns {Array} Array of {median, mean} objects (null if no data)
 */
function aggregateLikertData(rawData, questionKeys, { min = 1, max = 5 } = {}) {
  return questionKeys.map(key => {
    const values = rawData
      .map(row => row[key])
      .filter(val => val !== null && val !== undefined && val !== '' && Number.isFinite(Number(val)) && Number(val) >= min && Number(val) <= max);

    if (values.length === 0) {
      return { median: null, mean: null };
    }

    const numValues = values.map(Number);
    const mean = numValues.reduce((sum, val) => sum + val, 0) / numValues.length;

    const sorted = [...numValues].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];

    return {
      median: Number(median.toFixed(2)),
      mean: Number(mean.toFixed(2))
    };
  });
}

/**
 * Count frequencies for multiple choice questions
 * @param {Array} rawData - CSV rows
 * @param {Array} questionKeys - Column names
 * @returns {Array} Array of frequency objects
 */
function aggregateMultipleChoice(rawData, questionKeys) {
  return questionKeys.map(key => {
    const frequencies = {};
    let total = 0;

    rawData.forEach(row => {
      const value = row[key];
      if (value !== null && value !== undefined && value !== '') {
        frequencies[value] = (frequencies[value] || 0) + 1;
        total++;
      }
    });

    return Object.entries(frequencies).map(([option, count]) => ({
      option: String(option),
      count,
      percentage: Number(((count / total) * 100).toFixed(1))
    })).sort((a, b) => b.count - a.count);
  });
}
