/**
 * Questions for Teil B - binary choices
 */
const TEIL_B_QUESTIONS = [
  { title: 'In einem Szenario textiler Destabilisierung bevorzuge ich:', options: ['Erhalt beider, jedoch perforierter Socken', 'Vollständige Eliminierung einer einzelnen Socke'] },
  { title: 'Ich priorisiere bei textiler Auswahl:', options: ['Maximale visuelle Kongruenz', 'Maximale individualistische Divergenz'] },
  { title: 'Im Kontext langfristiger Nutzung bewerte ich als bedeutsamer:', options: ['Strukturelle Haltbarkeit', 'Ästhetische Musterkomplexität'] },
  { title: 'Bei drohendem Sockenschwund neige ich eher zu:', options: ['Aktiver Suchinitiative', 'Akzeptanzbasierter Verlustverarbeitung'] },
  { title: 'In Bezug auf textile Paarbildung empfinde ich als zentraler:', options: ['Symmetrische Gleichwertigkeit', 'Funktionale Ergänzung'] },
  { title: 'Bei geringfügiger Asymmetrie reagiere ich überwiegend mit:', options: ['Kognitiver Dissonanz', 'Flexibler Integrationsbereitschaft'] },
  { title: 'Im Falle chronischer Einzelsocken-Situation tendiere ich zu:', options: ['Persistierender Hoffnung', 'Adaptiver Neubildung'] },
  { title: 'Innerhalb der Sockenschublade erachte ich als stabilisierender:', options: ['Klare kategoriale Ordnung', 'Emergente Koexistenz'] },
  { title: 'Bei erhöhtem Stressniveau greife ich überwiegend auf:', options: ['Vertrautes Sockenduo', 'Funktional austauschbare Einheiten'] }
];

/**
 * Questions for Teil C - multiple options (0-based index)
 */
const TEIL_C_QUESTIONS = [
  { title: 'Bevorzugte Sockenlänge:', options: ['Keine Socken', 'No-Show', 'Knöchellänge', 'Mittlere Länge', 'Knielang', 'Situationsabhängig'] },
  { title: 'Falt-/Lagerungsstrategie:', options: ['Überlappungsfaltung', 'Kompressionsbasierte Bündelung', 'Lineare Parallelfaltung', 'Unstrukturierte Ablage'] },
  { title: 'Farbkategorie:', options: ['Achromatische Töne', 'Gedämpfte Chromatik', 'Helle/kontrastreiche Farben', 'Situationsabhängig'] },
  { title: 'Textile Oberflächenpräferenz:', options: ['Überwiegend unifarben', 'Gelegentlich gemustert', 'Überwiegend gemustert', 'Muster als Identitätsmerkmal'] },
  { title: 'Affektive Veränderung bei gemusterten Socken:', options: ['Stimmungsaufhellung', 'Erhöhte Selbstwirksamkeit', 'Keine Veränderung', 'Keine Angabe'] },
  { title: 'Reaktion auf veränderte Sockenschublade:', options: ['Keine Reaktion', 'Kurzfristige Irritation', 'Wahrnehmbarer Ordnungsimpuls', 'Deutliche Dysregulation'] },
  { title: 'Häufigkeit des Tragens identischer Socken an aufeinanderfolgenden Tagen:', options: ['Nie', 'Selten', 'Gelegentlich', 'Regelmäßig', 'Immer'] }
];

/**
 * Render horizontal bar charts
 * @param {string} containerId - Container element ID
 * @param {Array} data - Aggregated data array (one entry per question)
 * @param {Array} questions - Question metadata [{title, options}]
 */
export function renderBarCharts(containerId, data, questions) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  data.forEach((frequencies, index) => {
    if (!frequencies || frequencies.length === 0) return;

    const questionData = questions[index];
    if (!questionData) return;
    const card = createBarChartCard(questionData.title, frequencies, questionData.options);
    container.appendChild(card);
  });

  // Trigger animations after render using IntersectionObserver for scroll-triggered animation
  const cards = container.querySelectorAll('.visualization-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('.bar-fill').forEach(bar => {
          bar.classList.add('animate');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => observer.observe(card));
}

/**
 * Create a single bar chart card
 */
function createBarChartCard(title, frequencies, optionLabels) {
  const card = document.createElement('div');
  card.className = 'visualization-card';
  card.setAttribute('role', 'region');
  card.setAttribute('aria-label', title);

  const barsHTML = frequencies.map(freq => {
    // option is a string like "0", "1", "2" etc - use as index into optionLabels
    const optionIndex = parseInt(freq.option, 10);
    const label = optionLabels[optionIndex] !== undefined ? optionLabels[optionIndex] : `Option ${freq.option}`;
    const pct = Number(freq.percentage).toFixed(1);
    const showInside = freq.percentage >= 15;
    return `
      <div class="bar-chart-item">
        <div class="bar-label">${label}</div>
        <div class="bar-container">
          <div class="bar-fill" style="--bar-width: ${pct} %" title="${pct} %">
            ${showInside ? `<span class="bar-percentage">${pct} %</span>` : ''}
          </div>
        </div>
        ${!showInside ? `<span class="bar-percentage-outside">${pct} %</span>` : ''}
      </div>
    `;
  }).join('');

  card.innerHTML = `
    <div class="visualization-title">${title}</div>
    <div class="bar-chart">
      ${barsHTML}
    </div>
  `;

  return card;
}

export { TEIL_B_QUESTIONS, TEIL_C_QUESTIONS };
