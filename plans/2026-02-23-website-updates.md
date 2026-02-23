# Website-Updates Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Alle offenen Anforderungen umsetzen: Teil E hinzufügen, frage_c3-Freitext korrekt anzeigen, Abschiedsbriefe-Labels korrigieren, Bugs fixen, Danke-Seite mit PDF-Download ergänzen.

**Architecture:** Vanilla JS SPA mit Vite. Jede Änderung ist isoliert: erst Daten (csv-parser), dann Visualisierung (visualizations/), dann HTML-Struktur (index.html), dann Verkabelung (main.js). Die Seiten werden in neue Reihenfolge gebracht: A → B → C → D (Zeichnungen+Briefe) → E (neu) → Danke.

**Tech Stack:** Vite, PapaParse, Swiper.js, Vanilla JS ES6+, CSS custom properties

**Working directory:** `/Users/angeral/Repositories/websites/multipage_website`

---

## Task 1: CSS-Bugfix — % Leerzeichen + Likert-Label-Sichtbarkeit

**Files:**
- Modify: `src/visualizations/bar-chart.js` (Zeilen 87, 90)
- Modify: `src/styles/visualizations.css` (Zeile 124)

**Schritt 1: % Leerzeichen in bar-chart.js fixen**

In `bar-chart.js`, `createBarChartCard()` Funktion — zwei Stellen ändern:

```javascript
// Zeile 87: aus ${pct}% wird ${pct} %
${showInside ? `<span class="bar-percentage">${pct} %</span>` : ''}

// Zeile 90: aus ${pct}% wird ${pct} %
${!showInside ? `<span class="bar-percentage-outside">${pct} %</span>` : ''}
```

**Schritt 2: Likert-Label-Margin erhöhen in visualizations.css**

```css
/* Vorher: */
.likert-track {
  position: relative;
  height: 4px;
  background: var(--color-gray-200);
  border-radius: 2px;
  margin: 28px 0 8px;
}

/* Nachher: */
.likert-track {
  position: relative;
  height: 4px;
  background: var(--color-gray-200);
  border-radius: 2px;
  margin: 52px 0 8px;
}
```

**Schritt 3: Im Browser prüfen**

```bash
npm run dev
```

Prüfen: % hat jetzt Leerzeichen, Median/Durchschnitt-Zahlen sichtbar auf der Likert-Skala.

**Schritt 4: Commit**

```bash
git add src/visualizations/bar-chart.js src/styles/visualizations.css
git commit -m "fix: add space before % sign and increase likert label margin for visibility"
```

---

## Task 2: TEIL_C_QUESTIONS korrigieren (frage_c3 ist Freitext)

**Files:**
- Modify: `src/visualizations/bar-chart.js`

**Problem:** frage_c3 ist Freitext ("Vorteile der Faltstrategie"). Die aktuelle TEIL_C_QUESTIONS-Definition hat 7 Einträge und behandelt frage_c3 fälschlicherweise als "Farbkategorie"-Balkendiagramm. Alle C-Fragen ab Index 2 sind dadurch falsch gemappt.

**Fix:** TEIL_C_QUESTIONS auf 6 Einträge reduzieren (für frage_c1, c2, c4, c5, c6, c7).

Die vollständige neue TEIL_C_QUESTIONS-Definition:

```javascript
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
```

Außerdem am Ende der Datei hinzufügen:

```javascript
// Teil E — Einzelne Antwort-Fragen (E1, E2, E3)
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
```

Export-Zeile aktualisieren:

```javascript
export { TEIL_B_QUESTIONS, TEIL_C_QUESTIONS, TEIL_E_SINGLE_QUESTIONS };
```

**Commit:**

```bash
git add src/visualizations/bar-chart.js
git commit -m "fix: correct TEIL_C_QUESTIONS mapping (skip frage_c3 text field), add TEIL_E_SINGLE_QUESTIONS"
```

---

## Task 3: csv-parser.js — frage_c3 als Text, Abschiedsbriefe mit Zugehörigkeit, Teil E

**Files:**
- Modify: `src/utils/csv-parser.js`

Dies ist die umfangreichste Änderung. Drei Dinge ändern sich:

### 3a: `aggregateLikertData` konfigurierbar machen (Skalengrenzen als Parameter)

```javascript
// Vorher:
function aggregateLikertData(rawData, questionKeys) {
  return questionKeys.map(key => {
    const values = rawData
      .map(row => row[key])
      .filter(val => val !== null && val !== undefined && val >= 1 && val <= 5);

    if (values.length === 0) {
      return { median: 0, mean: 0 };
    }
    ...
  });
}

// Nachher:
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
```

### 3b: `aggregateData` komplett ersetzen

```javascript
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
        zugehoerigkeit: row.zugehoerigkeit
      }))
      .filter(item => item.text),
    abschiebsbriefe: rawData
      .map(row => ({ text: row.abschiedsbrief, zugehoerigkeit: row.zugehoerigkeit }))
      .filter(item => item.text),
    zeichnungen: rawData.map(row => row.zeichnung_datei).filter(Boolean),
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
```

### 3c: Filter case-insensitive machen

```javascript
// Vorher:
const filtered = zugehoerigkeit === 'alle'
  ? rawRows
  : rawRows.filter(row => row.zugehoerigkeit === zugehoerigkeit);

// Nachher:
const filtered = zugehoerigkeit === 'alle'
  ? rawRows
  : rawRows.filter(row => (row.zugehoerigkeit || '').toLowerCase() === zugehoerigkeit.toLowerCase());
```

**Commit:**

```bash
git add src/utils/csv-parser.js
git commit -m "feat: add Teil E aggregation, fix frage_c3 as text, add zugehoerigkeit to abschiebsbriefe, case-insensitive filter"
```

---

## Task 4: text-list.js — Zugehörigkeits-Labels statt "Teilnehmer N"

**Files:**
- Modify: `src/visualizations/text-list.js`

Kompletter Ersatz des Dateiinhalts:

```javascript
/**
 * Render text list (goodbye letters or Faltstrategie quotes)
 * @param {string} containerId - Container element ID
 * @param {Array} items - Array of {text, zugehoerigkeit} objects or plain strings
 */
export function renderTextList(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = '<div class="text-list-empty">Keine Einträge vorhanden</div>';
    return;
  }

  container.innerHTML = '';

  items.forEach((item) => {
    const text = typeof item === 'string' ? item : item.text;
    const zugehoerigkeit = typeof item === 'string' ? null : item.zugehoerigkeit;
    const card = createTextCard(text, zugehoerigkeit);
    container.appendChild(card);
  });

  const cards = container.querySelectorAll('.text-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
}

/**
 * Create a single text card
 * @param {string} text - Text content
 * @param {string|null} zugehoerigkeit - 'patienten' | 'personal' | null
 * @returns {HTMLElement}
 */
function createTextCard(text, zugehoerigkeit) {
  const card = document.createElement('div');
  card.className = 'text-card';
  card.setAttribute('role', 'article');

  const sanitized = document.createElement('span');
  sanitized.textContent = text;
  const safeText = sanitized.innerHTML;

  let authorLabel;
  const z = (zugehoerigkeit || '').toLowerCase();
  if (z === 'personal') {
    authorLabel = 'Therapeutisches Teammitglied';
  } else if (z === 'patienten') {
    authorLabel = 'Patient';
  } else {
    authorLabel = 'Teilnehmer';
  }

  card.innerHTML = `
    <div class="text-card-content">„${safeText}"</div>
    <div class="text-card-author">— ${authorLabel}</div>
  `;

  return card;
}
```

**Commit:**

```bash
git add src/visualizations/text-list.js
git commit -m "feat: display Patient/Therapeutisches Teammitglied instead of Teilnehmer N in text cards"
```

---

## Task 5: likert-scale.js — Konfigurierbare Skala für Teil E Q4

**Files:**
- Modify: `src/visualizations/likert-scale.js`

Teil E Q4 hat eine 3-Punkte-Skala (0="Trifft nicht zu", 1="neutral", 2="Trifft zu"). `renderLikertScales` muss konfigurierbar werden.

Kompletter Ersatz des Dateiinhalts:

```javascript
/**
 * Teil A — Likert Scale Visualizations (1-5)
 * Teil E Q4 — 3-point scale (0-2) via config
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
const SCALE_LABELS_3 = ['Trifft nicht zu', 'neutral', 'Trifft zu'];

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
  const medianLabelOffset = overlap ? 'transform: translateY(-36px);' : '';
  const meanLabelOffset = overlap ? 'transform: translateY(-4px);' : '';

  const medianPct = toPercent(median, scaleMin, scaleMax);
  const meanPct = toPercent(mean, scaleMin, scaleMax);

  const markersHTML = hasData ? `
    <div class="likert-marker median" style="left: ${medianPct}">
      <span class="likert-marker-label" style="${medianLabelOffset}" aria-hidden="true">${medianDisplay}</span>
      <div class="likert-marker-dot" title="Median: ${medianDisplay}"></div>
    </div>
    <div class="likert-marker mean" style="left: ${meanPct}">
      <span class="likert-marker-label" style="${meanLabelOffset}" aria-hidden="true">${meanDisplay}</span>
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
 * Render Likert scale cards.
 * @param {string} containerId
 * @param {Array<{median: number|null, mean: number|null}>} data
 * @param {Object} config - Optional: { questions, scaleMin, scaleMax, scaleLabels, prefix }
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
```

Dann in `visualizations.css` einen Stil für `.likert-no-data` hinzufügen:

```css
.likert-no-data {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--color-gray-600);
  font-style: italic;
}
```

**Commit:**

```bash
git add src/visualizations/likert-scale.js src/styles/visualizations.css
git commit -m "feat: make likert scale configurable for 3-point Teil E scale, handle no-data state"
```

---

## Task 6: data.csv — Spalten für Teil E hinzufügen

**Files:**
- Modify: `public/data.csv`

Header-Zeile: 6 neue Spalten am Ende anhängen:

```
...;zeichnung_datei;frage_e1;frage_e2;frage_e3;frage_e4_1;frage_e4_2;frage_e4_3
```

Jede Datenzeile: 6 leere Werte (Semikolons) am Ende anhängen:

```
1;personal;60;...;drawing_001.jpeg;;;;;;
2;patienten;22;...;drawing_002.jpeg;;;;;;
3;patienten;20;...;drawing_003.jpeg;;;;;;
4;patienten;23;...;drawing_004.jpeg;;;;;;
5;patienten;19;...;drawing_005.jpeg;;;;;;
6;Patienten;23;...;drawing_006.jpeg;;;;;;
```

Die vollständige neue CSV-Datei:

```csv
teilnehmer_id;zugehoerigkeit;alter;geschlecht;befindlichkeit_vorher;frage_a1;frage_a2;frage_a3;frage_a4;frage_a5;frage_a6;frage_a7;frage_b1;frage_b2;frage_b3;frage_b4;frage_b5;frage_b6;frage_b7;frage_b8;frage_b9;frage_c1;frage_c2;frage_c3;frage_c4;frage_c5;frage_c6;frage_c7;abschiedsbrief;zeichnung_datei;frage_e1;frage_e2;frage_e3;frage_e4_1;frage_e4_2;frage_e4_3
1;personal;60;w;Leicht positiv aktiviert;5;4;4;1;1;5;5;1;0;0;0;0;0;0;0;0;3;0;„platzsparend & übersichtlich";0;1;2;2;Farwell!;drawing_001.jpeg;;;;;;
2;patienten;22;w;Leicht positiv aktiviert;2;4;4;5;1;5;5;0;0;0;0;0;0;1;0;0;2;1;„Kompakt, auf den ersten Blick Motiv erkennbar, Löcher verdrängt";0;0;0;2;Das Loch in dir, du Socke ähnelt dem Loch in meinem Herzen seit du fehlst :( I miss you;drawing_002.jpeg;;;;;;
3;patienten;20;w;Leicht irritiert;3;3;3;4;1;1;1;0;0;0;1;1;1;1;1;0;2;1;„einfach & schnell";3;1;2;0;Paul war Schuld. Tut mir leid. Auf wiedersehen.;drawing_003.jpeg;;;;;;
4;patienten;23;w;Leicht irritiert;5;4;4;4;4;5;5;0;0;0;1;0;1;0;1;0;3;1;„So gehen Sockenpaare nicht verloren und ich finde sie schneller.";3;2;2;2;Du warst immer eine treue Socke, aber Mama hat dich in der Waschtrommel vergessen.;drawing_004.jpeg;;;;;;
5;patienten;19;w;Deutlich positiv aktiviert;4;3;1;2;2;5;5;0;0;0;1;0;0;0;0;0;2;1;„Kompressionsbasierte Bündelung sorgt für maximale Sockenharmonie im Kasten, sowie für eine besonders effiziente Organisation!";0;0;2;1;Meine Liebste Socke, vor drei Waschgängen bist du in die Trommel gestiegen und nie wieder aufgetaucht! Ich hoff du führst nun ein erfülltes Leben wo auch immer du sein magst!;drawing_005.jpeg;;;;;;
6;Patienten;23;w;Deutlich positiv aktiviert;2;1;2;1;1;1;2;1;0;1;1;0;0;1;1;0;0;0;„In einem Sack voller Socken bleibt das Paar fest zusammen!";0;0;2;0;Danke für deine wärmende Begleitung. Ruhe in Frieden in den Tiefen der Waschmaschine!;drawing_006.jpeg;;;;;;
```

**Commit:**

```bash
git add public/data.csv
git commit -m "feat: add Teil E CSV columns (frage_e1-e3, frage_e4_1-e4_3) — empty until data collected"
```

---

## Task 7: index.html — Seitenstruktur umbauen

**Files:**
- Modify: `index.html`

Kompletter Ersatz. Die neue Struktur:
- Start (unverändert)
- Teil A (unverändert, außer Eyebrow-Klasse)
- Teil B (unverändert)
- Teil C (+ Faltstrategie-Texte-Sektion)
- Teil D (Zeichnungen-Slideshow OBEN + Abschiedsbriefe UNTEN, kein Filter)
- Teil E NEU (E1/E2/E3 Balkencharts + E4 Likert, mit Filter)
- Danke NEU

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Ergebnisse der Sockendynamik- und Paarbindungsinventar Studie">
  <meta name="theme-color" content="#000000">
  <title>Sockendynamik- und Paarbindungsinventar — Ergebnisse</title>
  <link rel="preload" href="/Socke_Bild.jpeg" as="image">
  <link rel="stylesheet" href="/src/styles/main.css">
</head>
<body>

  <!-- PAGE 1: Start -->
  <div class="page page-active" id="page-start">
    <div class="start-content">
      <img src="/Socke_Bild.jpeg" alt="Socke" class="start-sock-image">
      <h1 class="start-title">Sockendynamik- und Paarbindungsinventar</h1>
      <p class="start-subtitle">Die Resultate</p>
      <p class="start-hint">↓ Tippen zum Starten</p>
      <button class="start-btn" id="btn-start">Starten →</button>
    </div>
  </div>

  <!-- PAGE 2: Teil A -->
  <div class="page page-light" id="page-teil-a">
    <header class="page-header">
      <div class="section-eyebrow">
        <span class="section-number" aria-hidden="true">A</span>
        <div class="section-title-group">
          <h2>Teil A</h2>
          <p class="section-subtitle">Emotionale Bindung zu Socken &mdash; nie &rarr; immer</p>
        </div>
      </div>
      <div class="filter-bar" role="group" aria-label="Filter nach Zugehörigkeit">
        <button class="filter-btn active" data-filter="alle">Alle</button>
        <button class="filter-btn" data-filter="patienten">Patienten</button>
        <button class="filter-btn" data-filter="personal">Personal</button>
      </div>
    </header>
    <div class="page-content">
      <div id="teil-a-content" class="visualizations"></div>
      <footer class="impressum">
        © 2026 – Alle Faserrechte vorbehalten<br>
        Am Roseneck 6, 83209 Prien am Chiemsee, Station A5<br>
        Klinisches Institut für Textile Objektbeziehungen (KITO)
      </footer>
    </div>
  </div>

  <!-- PAGE 3: Teil B -->
  <div class="page page-light" id="page-teil-b">
    <header class="page-header">
      <div class="section-eyebrow">
        <span class="section-number" aria-hidden="true">B</span>
        <div class="section-title-group">
          <h2>Teil B</h2>
          <p class="section-subtitle">Entscheidungspräferenzen</p>
        </div>
      </div>
      <div class="filter-bar" role="group" aria-label="Filter nach Zugehörigkeit">
        <button class="filter-btn active" data-filter="alle">Alle</button>
        <button class="filter-btn" data-filter="patienten">Patienten</button>
        <button class="filter-btn" data-filter="personal">Personal</button>
      </div>
    </header>
    <div class="page-content">
      <div id="teil-b-content" class="visualizations"></div>
      <footer class="impressum">
        © 2026 – Alle Faserrechte vorbehalten<br>
        Am Roseneck 6, 83209 Prien am Chiemsee, Station A5<br>
        Klinisches Institut für Textile Objektbeziehungen (KITO)
      </footer>
    </div>
  </div>

  <!-- PAGE 4: Teil C -->
  <div class="page page-light" id="page-teil-c">
    <header class="page-header">
      <div class="section-eyebrow">
        <span class="section-number" aria-hidden="true">C</span>
        <div class="section-title-group">
          <h2>Teil C</h2>
          <p class="section-subtitle">Sockenpräferenzen &amp; Verhalten</p>
        </div>
      </div>
      <div class="filter-bar" role="group" aria-label="Filter nach Zugehörigkeit">
        <button class="filter-btn active" data-filter="alle">Alle</button>
        <button class="filter-btn" data-filter="patienten">Patienten</button>
        <button class="filter-btn" data-filter="personal">Personal</button>
      </div>
    </header>
    <div class="page-content">
      <div id="teil-c-content" class="visualizations"></div>
      <div class="section-divider">
        <h3 class="section-divider-title">C3 — Beschreibung der Vorteile der Faltstrategie</h3>
      </div>
      <div id="faltstrategien-content" class="text-list-container"></div>
      <footer class="impressum">
        © 2026 – Alle Faserrechte vorbehalten<br>
        Am Roseneck 6, 83209 Prien am Chiemsee, Station A5<br>
        Klinisches Institut für Textile Objektbeziehungen (KITO)
      </footer>
    </div>
  </div>

  <!-- PAGE 5: Teil D — Zeichnungen + Abschiedsbriefe -->
  <div class="page page-light" id="page-teil-d">
    <header class="page-header">
      <div class="section-eyebrow">
        <span class="section-number" aria-hidden="true">D</span>
        <div class="section-title-group">
          <h2>Teil D</h2>
          <p class="section-subtitle">Zeichnungen &amp; Abschiedsbriefe</p>
        </div>
      </div>
    </header>
    <div class="page-content">
      <div id="slideshow-container" class="slideshow-container"></div>
      <div class="section-divider">
        <h3 class="section-divider-title">Abschiedsbriefe an verlorene Socken</h3>
      </div>
      <div id="abschiebsbriefe-content" class="text-list-container"></div>
      <footer class="impressum">
        © 2026 – Alle Faserrechte vorbehalten<br>
        Am Roseneck 6, 83209 Prien am Chiemsee, Station A5<br>
        Klinisches Institut für Textile Objektbeziehungen (KITO)
      </footer>
    </div>
  </div>

  <!-- PAGE 6: Teil E — Postinterventionelle Reflexion -->
  <div class="page page-light" id="page-teil-e">
    <header class="page-header">
      <div class="section-eyebrow">
        <span class="section-number" aria-hidden="true">E</span>
        <div class="section-title-group">
          <h2>Teil E</h2>
          <p class="section-subtitle">Postinterventionelle Reflexion</p>
        </div>
      </div>
      <div class="filter-bar" role="group" aria-label="Filter nach Zugehörigkeit">
        <button class="filter-btn active" data-filter="alle">Alle</button>
        <button class="filter-btn" data-filter="patienten">Patienten</button>
        <button class="filter-btn" data-filter="personal">Personal</button>
      </div>
    </header>
    <div class="page-content">
      <div id="teil-e-single-content" class="visualizations"></div>
      <div class="section-divider">
        <h3 class="section-divider-title">E4 — Postinterventionelle Selbstbeurteilung</h3>
        <p class="section-divider-subtitle">Trifft nicht zu &rarr; Trifft zu</p>
      </div>
      <div id="teil-e-likert-content" class="visualizations"></div>
      <footer class="impressum">
        © 2026 – Alle Faserrechte vorbehalten<br>
        Am Roseneck 6, 83209 Prien am Chiemsee, Station A5<br>
        Klinisches Institut für Textile Objektbeziehungen (KITO)
      </footer>
    </div>
  </div>

  <!-- PAGE 7: Danke -->
  <div class="page page-danke" id="page-danke">
    <div class="danke-content">
      <p class="danke-kito">Klinisches Institut für Textile Objektbeziehungen (KITO)</p>
      <h1 class="danke-title">Vielen Dank für<br>Ihre Teilnahme!</h1>
      <p class="danke-subtitle">Sockendynamik- und Paarbindungsinventar (SPI-01, Revision 3.2)</p>
      <button class="pdf-download-btn" id="btn-pdf-download">
        ↓ Ergebnisse als PDF herunterladen
      </button>
    </div>
  </div>

  <!-- BOTTOM BAR -->
  <div class="bottom-bar hidden" id="bottom-bar">
    <button class="nav-btn" id="btn-back" aria-label="Zurück">← Zurück</button>
    <div class="dots" id="dots" aria-hidden="true"></div>
    <button class="nav-btn" id="btn-next" aria-label="Weiter">Weiter →</button>
  </div>

  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**Commit:**

```bash
git add index.html
git commit -m "feat: restructure pages — merge D+Zeichnungen, add Teil E page, add Danke page"
```

---

## Task 8: main.js — Alle neuen Visualisierungen verdrahten

**Files:**
- Modify: `src/main.js`

Kompletter Ersatz:

```javascript
import { PageRouter } from './router.js';
import { loadAndParseData, filterAndAggregate } from './utils/csv-parser.js';
import { renderLikertScales, TEIL_E_LIKERT_QUESTIONS } from './visualizations/likert-scale.js';
import { renderBarCharts, TEIL_B_QUESTIONS, TEIL_C_QUESTIONS, TEIL_E_SINGLE_QUESTIONS } from './visualizations/bar-chart.js';
import { renderSlideshow } from './visualizations/slideshow.js';
import { renderTextList } from './visualizations/text-list.js';

const PAGE_IDS = ['start', 'teil-a', 'teil-b', 'teil-c', 'teil-d', 'teil-e', 'danke'];

const TEIL_E_LIKERT_CONFIG = {
  questions: TEIL_E_LIKERT_QUESTIONS,
  scaleMin: 0,
  scaleMax: 2,
  scaleLabels: ['Trifft nicht zu', 'neutral', 'Trifft zu'],
  prefix: 'E4.'
};

document.addEventListener('DOMContentLoaded', async () => {
  const router = new PageRouter(PAGE_IDS);

  // PDF Download
  document.getElementById('btn-pdf-download')?.addEventListener('click', () => window.print());

  document.body.classList.add('loading-data');

  try {
    const data = await loadAndParseData();
    const rawRows = data.rawRows;

    renderLikertScales('teil-a-content', data.teilA);
    renderBarCharts('teil-b-content', data.teilB, TEIL_B_QUESTIONS);
    renderBarCharts('teil-c-content', data.teilC, TEIL_C_QUESTIONS);
    renderTextList('faltstrategien-content', data.faltstrategieTexte);
    renderTextList('abschiebsbriefe-content', data.abschiebsbriefe);
    renderSlideshow('slideshow-container', data.zeichnungen);
    renderBarCharts('teil-e-single-content', data.teilE.singleChoice, TEIL_E_SINGLE_QUESTIONS);
    renderLikertScales('teil-e-likert-content', data.teilE.likert3, TEIL_E_LIKERT_CONFIG);

    initFilter('teil-a', rawRows, (filtered) => {
      renderLikertScales('teil-a-content', filtered.teilA);
    });
    initFilter('teil-b', rawRows, (filtered) => {
      renderBarCharts('teil-b-content', filtered.teilB, TEIL_B_QUESTIONS);
    });
    initFilter('teil-c', rawRows, (filtered) => {
      renderBarCharts('teil-c-content', filtered.teilC, TEIL_C_QUESTIONS);
      renderTextList('faltstrategien-content', filtered.faltstrategieTexte);
    });
    initFilter('teil-e', rawRows, (filtered) => {
      renderBarCharts('teil-e-single-content', filtered.teilE.singleChoice, TEIL_E_SINGLE_QUESTIONS);
      renderLikertScales('teil-e-likert-content', filtered.teilE.likert3, TEIL_E_LIKERT_CONFIG);
    });

  } catch (error) {
    console.error('Failed to load data:', error);
    renderLikertScales('teil-a-content', []);
    renderBarCharts('teil-b-content', [], TEIL_B_QUESTIONS);
    renderBarCharts('teil-c-content', [], TEIL_C_QUESTIONS);
    renderTextList('faltstrategien-content', []);
    renderTextList('abschiebsbriefe-content', []);
    renderSlideshow('slideshow-container', []);
    renderBarCharts('teil-e-single-content', [], TEIL_E_SINGLE_QUESTIONS);
    renderLikertScales('teil-e-likert-content', [], TEIL_E_LIKERT_CONFIG);
  } finally {
    document.body.classList.remove('loading-data');
  }
});

function initFilter(pageId, rawRows, renderFn) {
  const page = document.getElementById(`page-${pageId}`);
  if (!page) return;

  const buttons = page.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filtered = filterAndAggregate(rawRows, btn.dataset.filter);
      renderFn(filtered);
    });
  });
}
```

**Commit:**

```bash
git add src/main.js
git commit -m "feat: wire up Teil E, Faltstrategie texts, updated Abschiedsbriefe, PDF download button"
```

---

## Task 9: CSS — Neue Styles für Danke-Seite, section-divider, print

**Files:**
- Modify: `src/styles/main.css` (print CSS, Danke-Seite)
- Modify: `src/styles/visualizations.css` (section-divider)

### 9a: Danke-Seite Styles in main.css hinzufügen

Am Ende von `main.css` anfügen:

```css
/* ===========================
   Danke-Seite
   =========================== */

.page-danke {
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.danke-content {
  text-align: center;
  color: var(--color-white);
  padding: var(--space-lg);
  max-width: 560px;
}

.danke-kito {
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: var(--space-md);
}

.danke-title {
  font-size: clamp(36px, 8vw, 72px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -1px;
  margin-bottom: var(--space-md);
  color: var(--color-white);
}

.danke-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: var(--space-xl);
}

.pdf-download-btn {
  display: inline-block;
  padding: 14px 32px;
  background: var(--color-white);
  color: #000;
  border: none;
  border-radius: 100px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
  letter-spacing: 0.01em;
}

.pdf-download-btn:hover {
  background: var(--color-gray-200);
  transform: translateY(-2px);
}

/* ===========================
   Print CSS — für PDF-Download
   =========================== */

@media print {
  .bottom-bar { display: none !important; }
  .filter-bar { display: none !important; }

  body { overflow: visible !important; }

  .page {
    position: static !important;
    display: block !important;
    transform: none !important;
    opacity: 1 !important;
    height: auto !important;
    min-height: 100vh;
    page-break-after: always;
    overflow: visible !important;
  }

  #page-start { display: none !important; }
  #page-danke { page-break-after: avoid; }

  .page-content {
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
  }

  .visualization-card {
    opacity: 1 !important;
    transform: none !important;
    page-break-inside: avoid;
  }

  .bar-fill {
    width: var(--bar-width) !important;
    transition: none !important;
  }

  .text-card {
    opacity: 1 !important;
    transform: none !important;
    page-break-inside: avoid;
  }

  .swiper { display: none !important; }
}
```

### 9b: section-divider in visualizations.css hinzufügen

```css
/* ===========================
   Section Divider (z.B. C3 Texte)
   =========================== */

.section-divider {
  margin: var(--space-xl) 0 var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-gray-200);
}

.section-divider-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-gray-600);
}

.section-divider-subtitle {
  font-size: 12px;
  color: var(--color-gray-600);
  margin-top: 4px;
}
```

**Commit:**

```bash
git add src/styles/main.css src/styles/visualizations.css
git commit -m "feat: add Danke page styles, section-divider, print CSS for PDF download"
```

---

## Task 10: Build + Deploy

**Schritt 1: Dev-Server starten und alles prüfen**

```bash
npm run dev
```

Checkliste:
- [ ] Teil A: Likert-Zahlen (Median/Durchschnitt) sichtbar
- [ ] Teil B: Prozentangaben mit Leerzeichen (`50,0 %`)
- [ ] Teil C: 6 Balkencharts mit korrekten Labels (kein "Farbkategorie" mehr als Freitext)
- [ ] Teil C: Faltstrategie-Textzitate sichtbar unter den Charts
- [ ] Teil C: Filter filtert auch die Textzitate
- [ ] Teil D: Zeichnungen-Slideshow + Abschiedsbriefe auf einer Seite
- [ ] Abschiedsbriefe: "Patient" / "Therapeutisches Teammitglied" statt "Teilnehmer 1"
- [ ] Teil E: 3 Balkencharts + 3 Likert-Karten (mit "Daten werden noch erhoben")
- [ ] Teil E: Filter funktioniert
- [ ] Danke-Seite: Schwarzer Hintergrund, Danke-Text, PDF-Button
- [ ] PDF-Button: Druckdialog öffnet sich, alle Seiten werden gezeigt
- [ ] Navigation: 6 Dots (A, B, C, D, E, Danke)

**Schritt 2: Build**

```bash
npm run build
```

Prüfen: Keine Build-Fehler.

**Schritt 3: Commit und Push**

```bash
git add docs/
git commit -m "build: update docs/ for GitHub Pages"
git push origin multipage_design
```
