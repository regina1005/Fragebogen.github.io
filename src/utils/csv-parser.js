import Papa from 'papaparse';

/**
 * Load and parse CSV data
 * @param {string} url - Path to CSV file
 * @returns {Promise<Object>} Parsed and aggregated data
 */
export async function loadAndParseData(url = '/data.csv') {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fehler beim Laden der CSV-Datei: HTTP ${response.status}`);
    }
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
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
    teilA: aggregateLikertData(rawData, ['frage_a1', 'frage_a2', 'frage_a3', 'frage_a4', 'frage_a5', 'frage_a6', 'frage_a7']),
    teilB: aggregateMultipleChoice(rawData, ['frage_b1', 'frage_b2', 'frage_b3', 'frage_b4', 'frage_b5', 'frage_b6', 'frage_b7', 'frage_b8', 'frage_b9']),
    teilC: aggregateMultipleChoice(rawData, ['frage_c1', 'frage_c2', 'frage_c3', 'frage_c4', 'frage_c5', 'frage_c6', 'frage_c7']),
    abschiebsbriefe: rawData.map(row => row.abschiedsbrief).filter(Boolean),
    zeichnungen: rawData.map(row => row.zeichnung_datei).filter(Boolean),
    teilnehmerAnzahl: rawData.length
  };
}

/**
 * Calculate median and mean for Likert scale questions
 * @param {Array} rawData - CSV rows
 * @param {Array} questionKeys - Column names for Likert questions
 * @returns {Array} Array of {median, mean} objects
 */
function aggregateLikertData(rawData, questionKeys) {
  return questionKeys.map(key => {
    const values = rawData
      .map(row => row[key])
      .filter(val => val !== null && val !== undefined && val >= 1 && val <= 5);

    if (values.length === 0) {
      return { median: 0, mean: 0 };
    }

    // Calculate mean
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

    // Calculate median
    const sorted = [...values].sort((a, b) => a - b);
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
      if (value !== null && value !== undefined) {
        frequencies[value] = (frequencies[value] || 0) + 1;
        total++;
      }
    });

    // Convert to array with percentages
    return Object.entries(frequencies).map(([option, count]) => ({
      option: String(option),
      count,
      percentage: Number(((count / total) * 100).toFixed(1))
    })).sort((a, b) => b.count - a.count);
  });
}
