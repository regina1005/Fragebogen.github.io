# Mehrseiten-Design Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Umbau der scrollbaren Single-Page-App zu einer 6-Seiten-App mit Slide-Übergängen und Bottom-Navigation.

**Architecture:** Single `index.html` mit 6 `position:fixed` Panels. Nur das aktive Panel sichtbar. JavaScript-Router verwaltet Seitenwechsel mit CSS-Slide-Animation (translateX). Alle Visualisierungsmodule bleiben unverändert.

**Tech Stack:** Vite, Vanilla JavaScript ES6+, CSS3 Transforms

---

## Task 1: Worktree einrichten

**Step 1: Worktree erstellen**

```bash
git worktree add .worktrees/multipage-design -b feature/multipage-design
cd .worktrees/multipage-design
```

**Step 2: Dependencies installieren**

```bash
npm install
```

Expected: `node_modules/` existiert, `npm run dev` startet auf Port 3000.

**Step 3: Dev-Server testen**

```bash
npm run dev
```

Expected: `http://localhost:3000` zeigt die aktuelle scrollbare Website.

**Step 4: Commit**

```bash
git add .
git commit -m "chore: set up multipage-design worktree" --allow-empty
```

---

## Task 2: CSS-Aufräumen & pages.css erstellen

**Files:**
- Delete: `src/styles/hero.css`
- Delete: `src/styles/navigation.css`
- Modify: `src/styles/main.css`
- Create: `src/styles/pages.css`

**Step 1: Nicht mehr benötigte CSS-Dateien löschen**

```bash
rm src/styles/hero.css
rm src/styles/navigation.css
```

**Step 2: main.css aktualisieren**

`src/styles/main.css` — die `@import`-Zeilen für `hero.css` und `navigation.css` entfernen, stattdessen `pages.css` importieren. Außerdem `scroll-padding-top` und die `.nav`-Print-Regel entfernen da sie nicht mehr relevant sind.

Neue Datei `src/styles/main.css`:

```css
@import './reset.css';
@import './variables.css';
@import './pages.css';
@import './visualizations.css';
@import './slideshow.css';

body {
  font-family: var(--font-family);
  font-size: var(--font-size-body);
  color: var(--color-gray-800);
  background-color: var(--color-white);
  line-height: var(--line-height-normal);
  overflow: hidden; /* Kein Body-Scroll — Pages handhaben ihren eigenen Scroll */
}

h1, h2, h3 {
  line-height: var(--line-height-tight);
  font-weight: 700;
}

h1 { font-size: var(--font-size-h1); }
h2 { font-size: var(--font-size-h2); }

/* Utilities */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.error {
  background: #ffebee;
  color: #c62828;
  padding: var(--space-md);
  border-radius: 8px;
  margin: var(--space-lg) 0;
  text-align: center;
}

a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--color-red-primary);
  outline-offset: 2px;
}

@media print {
  .bottom-bar,
  .swiper-button-prev,
  .swiper-button-next {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

body.loading-data .visualizations::before {
  content: 'Lade Daten...';
  display: block;
  padding: var(--space-lg);
  color: var(--color-gray-600);
  text-align: center;
}
```

**Step 3: pages.css erstellen**

Erstelle `src/styles/pages.css`:

```css
/* ============================================
   PAGES — Panel-Layout & Slide-Animation
   ============================================ */

/* Jede Seite ist ein Fixed-Overlay, standardmäßig rechts außerhalb */
.page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-white);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  will-change: transform;
  overflow: hidden;
}

/* Aktive Seite ist sichtbar */
.page.page-active {
  transform: translateX(0);
}

/* ============================================
   STARTSEITE
   ============================================ */

#page-start {
  background: var(--color-black);
  cursor: pointer;
  justify-content: center;
  align-items: center;
}

.start-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: var(--padding);
  text-align: center;
  gap: var(--space-md);
}

.start-sock-image {
  max-width: 70%;
  max-height: 40vh;
  object-fit: contain;
}

.start-title {
  color: var(--color-white);
  font-size: clamp(20px, 5vw, 36px);
  font-weight: 700;
  line-height: 1.2;
}

.start-hint {
  color: var(--color-gray-600);
  font-size: 14px;
  letter-spacing: 0.05em;
}

.start-btn {
  background: var(--color-red-primary);
  color: var(--color-white);
  border: none;
  padding: 14px 32px;
  border-radius: 100px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  min-height: 44px;
}

.start-btn:hover {
  background: var(--color-red-dark);
}

.start-btn:active {
  transform: scale(0.97);
}

/* ============================================
   ERGEBNISSEITEN (A–E)
   ============================================ */

.page-header {
  padding: var(--space-md) var(--padding) var(--space-sm);
  border-bottom: 1px solid var(--color-gray-200);
  flex-shrink: 0;
  background: var(--color-white);
}

.page-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: var(--space-md) var(--padding);
  padding-bottom: calc(60px + var(--space-xl)); /* Raum für Bottom-Bar */
}

/* Zeichnungen-Seite: dunkler Hintergrund */
#page-teil-e {
  background: var(--color-black);
}

#page-teil-e .page-header {
  background: var(--color-black);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

#page-teil-e .section-number {
  color: rgba(255, 255, 255, 0.08);
}

#page-teil-e h2,
#page-teil-e .section-subtitle {
  color: var(--color-white);
}

/* ============================================
   BOTTOM BAR
   ============================================ */

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--padding);
  z-index: 1000;
  transition: opacity 0.2s ease;
}

.bottom-bar.hidden {
  display: none;
}

.nav-btn {
  background: none;
  border: none;
  color: var(--color-white);
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-family);
  cursor: pointer;
  padding: var(--space-xs) var(--space-sm);
  border-radius: 4px;
  min-width: 88px;
  min-height: 44px;
  transition: background-color 0.2s ease;
  text-align: center;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-btn:disabled,
.nav-btn[aria-hidden="true"] {
  visibility: hidden;
  pointer-events: none;
}

/* ============================================
   DOTS-INDIKATOR
   ============================================ */

.dots {
  display: flex;
  gap: 8px;
  align-items: center;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  transition: background-color 0.25s ease, transform 0.25s ease;
  flex-shrink: 0;
}

.dot.dot-active {
  background: var(--color-red-primary);
  transform: scale(1.2);
}
```

**Step 4: Dev-Server testen**

```bash
npm run dev
```

Expected: Seite lädt (zwar kaputt weil HTML noch nicht angepasst), aber keine CSS-Import-Fehler in der Konsole.

**Step 5: Commit**

```bash
git add src/styles/main.css src/styles/pages.css
git commit -m "feat: add page-router CSS, remove hero/nav styles"
```

---

## Task 3: index.html — 6-Panel-Struktur

**Files:**
- Modify: `index.html`

**Step 1: index.html komplett ersetzen**

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
      <p class="start-hint">↓ Tippen zum Starten</p>
      <button class="start-btn" id="btn-start">Starten →</button>
    </div>
  </div>

  <!-- PAGE 2: Teil A -->
  <div class="page" id="page-teil-a">
    <header class="page-header">
      <div class="section-eyebrow">
        <span class="section-number" aria-hidden="true">A</span>
        <div class="section-title-group">
          <h2>Teil A</h2>
          <p class="section-subtitle">Emotionale Bindung zu Socken &mdash; nie &rarr; immer</p>
        </div>
      </div>
    </header>
    <div class="page-content">
      <div id="teil-a-content" class="visualizations"></div>
    </div>
  </div>

  <!-- PAGE 3: Teil B -->
  <div class="page" id="page-teil-b">
    <header class="page-header">
      <div class="section-eyebrow">
        <span class="section-number" aria-hidden="true">B</span>
        <div class="section-title-group">
          <h2>Teil B</h2>
          <p class="section-subtitle">Entscheidungspräferenzen</p>
        </div>
      </div>
    </header>
    <div class="page-content">
      <div id="teil-b-content" class="visualizations"></div>
    </div>
  </div>

  <!-- PAGE 4: Teil C -->
  <div class="page" id="page-teil-c">
    <header class="page-header">
      <div class="section-eyebrow">
        <span class="section-number" aria-hidden="true">C</span>
        <div class="section-title-group">
          <h2>Teil C</h2>
          <p class="section-subtitle">Sockenpräferenzen &amp; Verhalten</p>
        </div>
      </div>
    </header>
    <div class="page-content">
      <div id="teil-c-content" class="visualizations"></div>
    </div>
  </div>

  <!-- PAGE 5: Teil D — Abschiebsbriefe -->
  <div class="page" id="page-teil-d">
    <header class="page-header">
      <div class="section-eyebrow">
        <span class="section-number" aria-hidden="true">D</span>
        <div class="section-title-group">
          <h2>Abschiebsbriefe</h2>
          <p class="section-subtitle">Abschiedsbriefe an verlorene Socken</p>
        </div>
      </div>
    </header>
    <div class="page-content">
      <div id="abschiebsbriefe-content" class="text-list-container"></div>
    </div>
  </div>

  <!-- PAGE 6: Teil E — Zeichnungen -->
  <div class="page" id="page-teil-e">
    <header class="page-header">
      <div class="section-eyebrow">
        <span class="section-number" aria-hidden="true">E</span>
        <div class="section-title-group">
          <h2>Zeichnungen</h2>
          <p class="section-subtitle">Präferierte Socken der Teilnehmer</p>
        </div>
      </div>
    </header>
    <div class="page-content">
      <div id="slideshow-container" class="slideshow-container"></div>
    </div>
  </div>

  <!-- BOTTOM BAR (alle Ergebnisseiten) -->
  <div class="bottom-bar hidden" id="bottom-bar">
    <button class="nav-btn" id="btn-back">← Zurück</button>
    <div class="dots" id="dots" aria-hidden="true"></div>
    <button class="nav-btn" id="btn-next">Weiter →</button>
  </div>

  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**Step 2: Dev-Server testen**

```bash
npm run dev
```

Expected:
- Schwarze Startseite mit Sockenbild, Titel, „Tippen zum Starten" und Starten-Button
- Nur die Startseite sichtbar, alle anderen Panels versteckt (off-screen rechts)

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: replace scrollable layout with 6-panel page structure"
```

---

## Task 4: PageRouter erstellen (`src/router.js`)

**Files:**
- Create: `src/router.js`

**Step 1: router.js erstellen**

```javascript
/**
 * PageRouter — verwaltet die 6-Seiten-Navigation
 *
 * Seiten-Reihenfolge:
 *   0: start
 *   1: teil-a
 *   2: teil-b
 *   3: teil-c
 *   4: teil-d
 *   5: teil-e
 */
export class PageRouter {
  constructor(pageIds) {
    this.pages = pageIds;
    this.currentIndex = 0;
    this.isAnimating = false;

    this.btnBack = document.getElementById('btn-back');
    this.btnNext = document.getElementById('btn-next');
    this.btnStart = document.getElementById('btn-start');
    this.dotsContainer = document.getElementById('dots');
    this.bottomBar = document.getElementById('bottom-bar');

    this._initDots();
    this._bindEvents();
    this._update();
  }

  /** Erstellt die Dot-Elemente (eines pro Ergebnisseite, d.h. pages.length - 1) */
  _initDots() {
    this.dotsContainer.innerHTML = '';
    for (let i = 1; i < this.pages.length; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      this.dotsContainer.appendChild(dot);
    }
  }

  /** Bindet Klick-Events an Buttons */
  _bindEvents() {
    this.btnBack.addEventListener('click', () => this.back());
    this.btnNext.addEventListener('click', () => this.next());

    // Startseite: Button und Bild-Klick starten
    if (this.btnStart) {
      this.btnStart.addEventListener('click', (e) => {
        e.stopPropagation();
        this.next();
      });
    }
    const startPage = document.getElementById(`page-${this.pages[0]}`);
    if (startPage) {
      startPage.addEventListener('click', () => this.next());
    }
  }

  /** Weiterblättern */
  next() {
    if (this.isAnimating || this.currentIndex >= this.pages.length - 1) return;
    this._animateTo(this.currentIndex + 1, 'forward');
  }

  /** Zurückblättern */
  back() {
    if (this.isAnimating || this.currentIndex <= 0) return;
    this._animateTo(this.currentIndex - 1, 'backward');
  }

  /**
   * Navigiert zu einer Seite mit Slide-Animation
   * @param {number} newIndex
   * @param {'forward'|'backward'} direction
   */
  _animateTo(newIndex, direction) {
    this.isAnimating = true;

    const exitEl = document.getElementById(`page-${this.pages[this.currentIndex]}`);
    const enterEl = document.getElementById(`page-${this.pages[newIndex]}`);
    const duration = 300;

    // Eintretende Seite sofort an die richtige Ausgangsposition setzen (kein Übergang)
    enterEl.style.transition = 'none';
    enterEl.style.transform = direction === 'forward' ? 'translateX(100%)' : 'translateX(-100%)';
    enterEl.classList.add('page-active');

    // Erzwinge Reflow damit die Position übernommen wird
    enterEl.offsetHeight; // eslint-disable-line no-unused-expressions

    // Beide Seiten animieren
    const easing = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    exitEl.style.transition = easing;
    exitEl.style.transform = direction === 'forward' ? 'translateX(-100%)' : 'translateX(100%)';
    enterEl.style.transition = easing;
    enterEl.style.transform = 'translateX(0)';

    // Dots und Buttons sofort aktualisieren
    this.currentIndex = newIndex;
    this._update();

    setTimeout(() => {
      // Aufräumen nach der Animation
      exitEl.classList.remove('page-active');
      exitEl.style.transition = '';
      exitEl.style.transform = '';
      enterEl.style.transition = '';
      enterEl.style.transform = '';
      this.isAnimating = false;
    }, duration);
  }

  /** Aktualisiert Bottom-Bar, Dots und Buttons je nach aktueller Seite */
  _update() {
    const isStart = this.currentIndex === 0;
    const isLast = this.currentIndex === this.pages.length - 1;

    // Bottom-Bar: auf Startseite versteckt
    this.bottomBar.classList.toggle('hidden', isStart);

    // Zurück-Button: immer sichtbar auf Ergebnisseiten (auch auf Seite A → zurück zur Startseite)
    this.btnBack.setAttribute('aria-hidden', isStart ? 'true' : 'false');

    // Weiter-Button: auf letzter Seite versteckt
    this.btnNext.setAttribute('aria-hidden', isLast ? 'true' : 'false');

    // Dots: dot i entspricht Seite i+1 (0-basiert: dot 0 = teil-a, dot 5 = teil-e)
    const dots = this.dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('dot-active', i + 1 === this.currentIndex);
    });
  }
}
```

**Step 2: Dev-Server testen**

Noch nicht integriert — kein visueller Test möglich. Weiter zu Task 5.

**Step 3: Commit**

```bash
git add src/router.js
git commit -m "feat: add PageRouter class for slide navigation"
```

---

## Task 5: main.js aktualisieren

**Files:**
- Modify: `src/main.js`

**Step 1: main.js ersetzen**

```javascript
import { PageRouter } from './router.js';
import { loadAndParseData } from './utils/csv-parser.js';
import { renderLikertScales } from './visualizations/likert-scale.js';
import { renderBarCharts, TEIL_B_QUESTIONS, TEIL_C_QUESTIONS } from './visualizations/bar-chart.js';
import { renderSlideshow } from './visualizations/slideshow.js';
import { renderTextList } from './visualizations/text-list.js';

const PAGE_IDS = ['start', 'teil-a', 'teil-b', 'teil-c', 'teil-d', 'teil-e'];

document.addEventListener('DOMContentLoaded', async () => {
  // Router initialisieren
  const router = new PageRouter(PAGE_IDS);

  // Lade-Indikator aktivieren
  document.body.classList.add('loading-data');

  try {
    const data = await loadAndParseData();

    renderLikertScales('teil-a-content', data.teilA);
    renderBarCharts('teil-b-content', data.teilB, TEIL_B_QUESTIONS);
    renderBarCharts('teil-c-content', data.teilC, TEIL_C_QUESTIONS);
    renderTextList('abschiebsbriefe-content', data.abschiebsbriefe);
    renderSlideshow('slideshow-container', data.zeichnungen);

  } catch (error) {
    console.error('Failed to load data:', error);
    renderLikertScales('teil-a-content', []);
    renderBarCharts('teil-b-content', [], TEIL_B_QUESTIONS);
    renderBarCharts('teil-c-content', [], TEIL_C_QUESTIONS);
    renderTextList('abschiebsbriefe-content', []);
    renderSlideshow('slideshow-container', []);
  } finally {
    document.body.classList.remove('loading-data');
  }
});
```

**Step 2: scroll.js löschen**

```bash
rm src/utils/scroll.js
```

**Step 3: Dev-Server testen**

```bash
npm run dev
```

Expected:
- Schwarze Startseite erscheint
- Klick auf „Starten →" oder Sockenbild → Teil A slides von rechts rein
- Bottom-Bar mit ← Zurück, 6 Dots (erster aktiv rot), Weiter → erscheint
- Weiter/Zurück navigiert korrekt durch alle 6 Seiten
- Auf Seite E: kein „Weiter"-Button
- Zurück von Seite A → Startseite (Bottom-Bar verschwindet)
- Alle Visualisierungen rendern sich (mit Placeholder-Daten aus `public/data.csv`)

**Step 4: Commit**

```bash
git add src/main.js
git commit -m "feat: wire up PageRouter in main.js, remove scroll.js"
```

---

## Task 6: Build & finaler Commit

**Step 1: Production Build**

```bash
npm run build
```

Expected: `docs/` Ordner wird neu erstellt, 0 Errors, 0 Warnings.

**Step 2: Visuell prüfen**

```bash
npm run preview
```

Testen:
- [ ] Startseite erscheint (schwarz, Socke, Titel, Button)
- [ ] Starten-Klick → Teil A mit Slide-Animation
- [ ] Bottom-Bar zeigt 6 Dots, erster aktiv (rot)
- [ ] Weiter/Zurück durch alle 6 Seiten
- [ ] Letzter Seite (E): kein Weiter-Button
- [ ] Zurück von A → Startseite (Bottom-Bar verschwindet)
- [ ] Seite D (Abschiebsbriefe): Textkarten sichtbar
- [ ] Seite E (Zeichnungen): schwarzer Hintergrund, Swiper
- [ ] `npm run preview` zeigt fertigen Build

**Step 3: Finaler Commit**

```bash
git add docs/
git commit -m "build: production build for multipage version"
```

---

## Offene Punkte (nicht in diesem Plan)

- Echte CSV-Daten einpflegen (`public/data.csv`)
- Teilnehmer-Zeichnungen nach `public/drawings/` kopieren
- Deployment auf GitHub Pages
