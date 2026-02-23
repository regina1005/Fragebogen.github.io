/**
 * Likert Scale Visualizations
 * - Teil A: 5-point scale (1-5, nie → immer)
 * - Teil E Q4: 3-point scale (0-2, Trifft nicht zu → Trifft zu) via config
 */

const TEIL_A_QUESTIONS = [
  'Ich empfinde eine tiefe Loyalität gegenüber zusammengehörigen Socken.',
  'Der Verlust einer Socke beeinflusst meine emotionale Grundstimmung messbar.',
  'Ich habe schon einmal aktiv nach einer einzelnen Socke gesucht, obwohl die Wahrscheinlichkeit gering war.',
  'Gemusterte Socken vermitteln mir mehr Identitätsstabilität als einfarbige.',
  'Ich glaube, dass Socken im Wäschekorb soziale Bindungen eingehen.',
  'Zwei unterschiedliche Socken zu tragen fühlt sich rebellisch-autonom an.',
  'Das Wegwerfen einer Einzelsocke ist ein Akt innerer Reife.'
];

export const TEIL_E_LIKERT_QUESTIONS = [
  'Durch die Bearbeitung dieses Fragebogens hat sich meine Perspektive auf meine Beziehung zu Socken verändert.',
  'Ich nehme aktuell eine erhöhte Bewusstheit hinsichtlich textiler Mikroentscheidungen wahr.',
  'Ich gehe davon aus, dass die Auseinandersetzung mit textiler Bindungsdynamik mein zukünftiges Sockenauswahlverhalten beeinflussen wird.'
];

const SCALE_LABELS_5 = ['nie', 'selten', 'manchmal', 'oft', 'immer'];

/**
 * Convert a value to a percentage position on the scale track.
 */
function toPercent(value, scaleMin, scaleMax) {
  if (value === null || value === undefined) return '50%';
  return `${((value - scaleMin) / (scaleMax - scaleMin)) * 100}%`;
}

/**
 * Create a single Likert scale visualization card.
 */
function createLikertCard(question, median, mean, index, config) {
  const { scaleMin, scaleMax, scaleLabels, prefix } = config;
  const card = document.createElement('div');
  card.className = 'visualization-card';
  card.setAttribute('aria-label', `Frage ${prefix}${index + 1}: ${question}`);

  const hasData = median !== null && mean !== null;

  const medianDisplay = hasData ? Number(median).toFixed(1) : '–';
  const meanDisplay = hasData ? Number(mean).toFixed(1) : '–';

  const overlap = hasData && Math.abs(median - mean) < 0.4;
  /* When overlapping: push the mean marker below the track and flip its label to show underneath */
  const meanMarkerStyle = overlap ? 'top: 28px;' : '';
  const meanLabelStyle = overlap ? 'position: absolute; top: 14px; transform: none;' : '';

  const medianPct = toPercent(median, scaleMin, scaleMax);
  const meanPct = toPercent(mean, scaleMin, scaleMax);

  const markersHTML = hasData ? `
    <div class="likert-marker median" style="left: ${medianPct}">
      <span class="likert-marker-label" aria-hidden="true">${medianDisplay}</span>
      <div class="likert-marker-dot" title="Median: ${medianDisplay}"></div>
    </div>
    <div class="likert-marker mean" style="left: ${meanPct}; ${meanMarkerStyle}">
      <span class="likert-marker-label" style="${meanLabelStyle}" aria-hidden="true">${meanDisplay}</span>
      <div class="likert-marker-dot" title="Durchschnitt: ${meanDisplay}"></div>
    </div>
  ` : '<div class="likert-no-data">Daten werden noch erhoben</div>';

  card.innerHTML = `
    <div class="visualization-card-index">${prefix}${index + 1}</div>
    <div class="visualization-title">${question}</div>
    <div class="likert-scale" role="img" aria-label="Likert-Skala: Median ${medianDisplay}, Durchschnitt ${meanDisplay}">
      <div class="likert-track">
        <div class="likert-ticks">
          ${scaleLabels.map(() => '<div class="likert-tick"></div>').join('')}
        </div>
        <div class="likert-markers">
          ${markersHTML}
        </div>
      </div>
      <div class="likert-labels" aria-hidden="true">
        ${scaleLabels.map(label => `<span>${label}</span>`).join('')}
      </div>
    </div>
    <div class="likert-legend" aria-hidden="true">
      <div class="likert-legend-item">
        <div class="likert-legend-dot median"></div>
        <span>Median: ${medianDisplay}</span>
      </div>
      <div class="likert-legend-item">
        <div class="likert-legend-dot mean"></div>
        <span>Durchschnitt: ${meanDisplay}</span>
      </div>
    </div>
  `;

  return card;
}

function observeCards(cards) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  cards.forEach((card) => observer.observe(card));
}

/**
 * Render Likert scale cards into the given container element.
 *
 * @param {string} containerId  The id of the target DOM element
 * @param {Array<{median: number|null, mean: number|null}>} data  Aggregated results
 * @param {Object} config  Optional: { questions, scaleMin, scaleMax, scaleLabels, prefix }
 */
export function renderLikertScales(containerId, data, config = {}) {
  const {
    questions = TEIL_A_QUESTIONS,
    scaleMin = 1,
    scaleMax = 5,
    scaleLabels = SCALE_LABELS_5,
    prefix = 'A'
  } = config;

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  const hasData = Array.isArray(data) && data.length > 0;

  questions.forEach((question, index) => {
    const entry = hasData && data[index] ? data[index] : { median: null, mean: null };
    const card = createLikertCard(question, entry.median, entry.mean, index, { scaleMin, scaleMax, scaleLabels, prefix });
    container.appendChild(card);
  });

  const cards = container.querySelectorAll('.visualization-card');
  observeCards(cards);
}
