/**
 * Teil A — Likert Scale Visualizations
 *
 * Renders one card per question showing median (red) and mean (dark)
 * markers on a 1–5 scale with staggered entrance animations.
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

const SCALE_LABELS = ['nie', 'selten', 'manchmal', 'oft', 'immer'];

/**
 * Convert a 1–5 value to a percentage position on the scale track.
 * @param {number} value
 * @returns {string} CSS percentage string
 */
function toPercent(value) {
  return `${((value - 1) / 4) * 100}%`;
}

/**
 * Create a single Likert scale visualization card.
 * @param {string} question
 * @param {number} median
 * @param {number} mean
 * @param {number} index  0-based card index for the eyebrow label
 * @returns {HTMLElement}
 */
function createLikertCard(question, median, mean, index) {
  const card = document.createElement('div');
  card.className = 'visualization-card';
  card.setAttribute('aria-label', `Frage A${index + 1}: ${question}`);

  // Round displayed values to one decimal place
  const medianDisplay = Number(median).toFixed(1);
  const meanDisplay = Number(mean).toFixed(1);

  // Determine if median and mean are close enough that labels would overlap.
  // If so, offset the mean label to avoid visual collision.
  const overlap = Math.abs(median - mean) < 0.4;
  const medianLabelOffset = overlap ? 'transform: translateY(-36px);' : '';
  const meanLabelOffset = overlap ? 'transform: translateY(-4px);' : '';

  card.innerHTML = `
    <div class="visualization-card-index">A${index + 1}</div>
    <div class="visualization-title">${question}</div>
    <div class="likert-scale" role="img" aria-label="Likert-Skala: Median ${medianDisplay}, Durchschnitt ${meanDisplay}">
      <div class="likert-track">
        <div class="likert-ticks">
          ${SCALE_LABELS.map(() => '<div class="likert-tick"></div>').join('')}
        </div>
        <div class="likert-markers">
          <div class="likert-marker median" style="left: ${toPercent(median)}">
            <span class="likert-marker-label" style="${medianLabelOffset}" aria-hidden="true">${medianDisplay}</span>
            <div class="likert-marker-dot" title="Median: ${medianDisplay}"></div>
          </div>
          <div class="likert-marker mean" style="left: ${toPercent(mean)}">
            <span class="likert-marker-label" style="${meanLabelOffset}" aria-hidden="true">${meanDisplay}</span>
            <div class="likert-marker-dot" title="Durchschnitt: ${meanDisplay}"></div>
          </div>
        </div>
      </div>
      <div class="likert-labels" aria-hidden="true">
        ${SCALE_LABELS.map(label => `<span>${label}</span>`).join('')}
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

/**
 * Set up an IntersectionObserver that adds the `.visible` class to each
 * card as it scrolls into view, triggering the entrance animation.
 * @param {NodeList|HTMLElement[]} cards
 */
function observeCards(cards) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  cards.forEach((card) => observer.observe(card));
}

/**
 * Render Likert scale cards into the given container element.
 *
 * Falls back gracefully when `data` is missing or empty — renders
 * placeholder cards with question text but no markers so the section
 * is still visually present while data is loading or unavailable.
 *
 * @param {string} containerId  The id of the target DOM element
 * @param {Array<{median: number, mean: number}>} data  Aggregated results
 */
export function renderLikertScales(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  const hasData = Array.isArray(data) && data.length > 0;

  TEIL_A_QUESTIONS.forEach((question, index) => {
    const { median, mean } = hasData && data[index]
      ? data[index]
      : { median: 0, mean: 0 };

    const card = createLikertCard(question, median, mean, index);
    container.appendChild(card);
  });

  // Trigger entrance animations
  const cards = container.querySelectorAll('.visualization-card');
  observeCards(cards);
}
