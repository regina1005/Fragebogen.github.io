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
 * Note: frage_c3 (Faltstrategie-Beschreibung) is a free-text field and skipped here
 */
const TEIL_C_QUESTIONS = [
  {
    title: 'Welche Sockenlänge präferieren Sie überwiegend im Alltag?',
    options: ['Keine Socken', 'No-Show-/Invisible-Socken', 'Knöchellänge', 'Mittlere Länge (Crew)', 'Knielang oder darüber', 'Situationsabhängige Variation']
  },
  {
    title: 'Welche Falt- bzw. Lagerungsstrategie wenden Sie überwiegend an?',
    options: ['Dyadische Überlappungsfaltung', 'Kompressionsbasierte Bündelung', 'Lineare Parallelfaltung', 'Unstrukturierte Ablage']
  },
  {
    title: 'Welche Farbkategorie präferieren Sie bei der Auswahl tragender Socken?',
    options: ['Achromatische Töne', 'Gedämpfte Chromatik', 'Helle/kontrastreiche Farben', 'Situationsabhängige Farbwahl']
  },
  {
    title: 'Wie würden Sie Ihre textile Oberflächenpräferenz beschreiben?',
    options: ['Überwiegend unifarbene Socken', 'Gelegentlich gemusterte Socken', 'Überwiegend gemusterte Socken', 'Muster als primäres Identitätsmerkmal']
  },
  {
    title: 'Inwiefern beobachten Sie eine Veränderung Ihrer affektiven Grundstimmung beim Tragen gemusterter Socken?',
    options: ['Subjektiv wahrnehmbare Stimmungsaufhellung', 'Erhöhte Selbstwirksamkeits- oder Expressivitätserfahrung', 'Keine relevante affektive Veränderung', 'Keine Angabe / Trage keine gemusterten Socken']
  },
  {
    title: 'Inwiefern reagieren Sie auf eine unerwartete Veränderung Ihrer Sockenschubladen- oder Lagerungsstruktur?',
    options: ['Keine subjektiv relevante Reaktion', 'Kurzfristige Irritation ohne Handlungsimpuls', 'Wahrnehmbarer Ordnungsimpuls mit Bedürfnis nach Wiederherstellung', 'Deutliche kognitive oder affektive Dysregulation bis zur unmittelbaren Reorganisation']
  }
];

/**
 * Questions for Teil E - single choice responses
 */
const TEIL_E_SINGLE_QUESTIONS = [
  {
    title: 'Wie beschreiben Sie Ihre aktuelle Gesamtbefindlichkeit?',
    options: ['Unverändert gegenüber dem Ausgangszustand', 'Leicht positiv aktiviert', 'Deutlich positiv aktiviert', 'Leicht irritiert', 'Deutlich irritiert', 'Schwer operationalisierbar']
  },
  {
    title: 'Falls Sie eine Veränderung wahrnehmen: Wo im Körper spüren Sie diese primär?',
    options: ['Kopfbereich', 'Brust-/Herzregion', 'Bauch-/Abdominalregion', 'Extremitäten', 'Keine spezifische Lokalisierung']
  },
  {
    title: 'Hat die Bearbeitung des Fragebogens zu allgemeinen Reflexionen über Ordnung, Verlust oder Paarbildung geführt?',
    options: ['Nein', 'In geringem Ausmaß', 'Moderat', 'Deutlich', 'In überraschend tiefgreifender Weise']
  }
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

  const barsHTML = optionLabels.map((label, index) => {
    const freq = frequencies.find(f => parseInt(f.option, 10) === index) || { count: 0, percentage: 0 };
    const pct = Number(freq.percentage).toFixed(1);
    const showInside = freq.percentage >= 15;

    return {
      html: `
        <div class="bar-chart-item">
          <div class="bar-label">${label}</div>
          <div class="bar-container">
            <div class="bar-fill" style="--bar-width: ${pct}%" title="${pct} %">
              ${showInside ? `<span class="bar-percentage">${pct} %</span>` : ''}
            </div>
          </div>
          ${!showInside ? `<span class="bar-percentage-outside">${pct} %</span>` : ''}
        </div>
      `,
      percentage: Number(freq.percentage)
    };
  })
    .sort((a, b) => b.percentage - a.percentage)
    .map(item => item.html)
    .join('');

  card.innerHTML = `
    <div class="visualization-title">${title}</div>
    <div class="bar-chart">
      ${barsHTML}
    </div>
  `;

  return card;
}

export { TEIL_B_QUESTIONS, TEIL_C_QUESTIONS, TEIL_E_SINGLE_QUESTIONS };
