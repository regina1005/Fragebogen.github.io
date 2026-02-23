# Sockendynamik-Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a mobile-first, Apple-style static website visualizing satirical sock study results with scroll animations and interactive charts.

**Architecture:** Vanilla JavaScript single-page application with Vite build tooling. CSV data loaded client-side, parsed, and aggregated into visualizations. Scroll-based hero animation using Intersection Observer. No backend required.

**Tech Stack:** Vite, Vanilla JS (ES6+), Chart.js, Swiper.js, PapaParse, CSS3

---

## Task 1: Project Setup & Dependencies

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`

**Step 1: Initialize project**

```bash
npm init -y
```

Expected: `package.json` created

**Step 2: Install dependencies**

```bash
npm install --save-dev vite
npm install chart.js swiper papaparse
```

Expected: Dependencies in package.json, node_modules created

**Step 3: Configure Vite**

Create `vite.config.js`:

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

**Step 4: Create base HTML**

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sockendynamik- und Paarbindungsinventar - Ergebnisse</title>
  <link rel="stylesheet" href="/src/styles/main.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**Step 5: Add npm scripts**

Modify `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Step 6: Test dev server**

Run: `npm run dev`
Expected: Dev server starts on http://localhost:3000, blank page loads

**Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.js index.html
git commit -m "feat: initialize Vite project with dependencies

- Add Vite, Chart.js, Swiper.js, PapaParse
- Configure dev server on port 3000
- Create base HTML structure

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: CSS Design System & Base Styles

**Files:**
- Create: `src/styles/main.css`
- Create: `src/styles/variables.css`
- Create: `src/styles/reset.css`

**Step 1: Create CSS reset**

Create `src/styles/reset.css`:

```css
/* Modern CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}
```

**Step 2: Create CSS variables**

Create `src/styles/variables.css`:

```css
:root {
  /* Colors */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-gray-100: #F5F5F7;
  --color-gray-200: #E8E8ED;
  --color-gray-600: #6E6E73;
  --color-gray-800: #1D1D1F;

  /* Accents (from sock) */
  --color-red-primary: #D32F2F;
  --color-red-dark: #B71C1C;

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.12);

  /* Spacing */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 48px;
  --space-xl: 64px;

  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-size-h1: 32px;
  --font-size-h2: 24px;
  --font-size-body: 16px;
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;

  /* Layout */
  --padding: 16px;
  --max-width: 1200px;
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  :root {
    --padding: 32px;
    --font-size-h1: 48px;
    --font-size-h2: 32px;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  :root {
    --padding: 64px;
    --font-size-h1: 64px;
    --font-size-h2: 40px;
  }
}
```

**Step 3: Create main styles**

Create `src/styles/main.css`:

```css
@import './reset.css';
@import './variables.css';

body {
  font-family: var(--font-family);
  font-size: var(--font-size-body);
  color: var(--color-gray-800);
  background-color: var(--color-white);
  line-height: var(--line-height-normal);
}

h1, h2, h3 {
  line-height: var(--line-height-tight);
  font-weight: 700;
}

h1 {
  font-size: var(--font-size-h1);
}

h2 {
  font-size: var(--font-size-h2);
}

.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--padding);
}

.section {
  padding: var(--space-xl) 0;
}

.section-header {
  margin-bottom: var(--space-lg);
}
```

**Step 4: Test styles**

Run: `npm run dev`
Expected: Page loads with system fonts, no visible content yet

**Step 5: Commit**

```bash
git add src/styles/
git commit -m "feat: add CSS design system with Apple-style variables

- CSS reset for consistency
- Design tokens (colors, spacing, typography)
- Responsive breakpoints for mobile-first design

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Hero Section with Scroll Animation

**Files:**
- Create: `src/styles/hero.css`
- Create: `src/utils/scroll.js`
- Modify: `index.html`
- Modify: `src/styles/main.css`

**Step 1: Create hero HTML structure**

Modify `index.html` body:

```html
<body>
  <!-- Hero Section -->
  <section id="hero" class="hero">
    <div class="hero-image">
      <img src="/Socke_Bild.jpeg" alt="Socke" class="sock-image">
    </div>
    <div class="hero-text">
      <h1>Sockendynamik- und Paarbindungsinventar</h1>
      <p>Ergebnisse</p>
    </div>
  </section>

  <!-- Main Content -->
  <div id="app" class="container"></div>

  <script type="module" src="/src/main.js"></script>
</body>
```

**Step 2: Create hero styles**

Create `src/styles/hero.css`:

```css
.hero {
  position: relative;
  width: 100%;
  height: 200vh; /* Allow scroll space for animation */
  background-color: var(--color-black);
  overflow: hidden;
}

.hero-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.3s ease-out;
}

.sock-image {
  max-width: 80%;
  max-height: 80vh;
  object-fit: contain;
}

.hero-text {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--color-white);
  opacity: 0;
  transition: opacity 0.3s ease-out;
  z-index: 10;
  padding: 0 var(--padding);
}

.hero-text h1 {
  margin-bottom: var(--space-sm);
  font-size: clamp(24px, 5vw, 48px);
}

.hero-text p {
  font-size: clamp(18px, 3vw, 32px);
  font-weight: 600;
}

@media (min-width: 768px) {
  .sock-image {
    max-width: 60%;
  }
}
```

**Step 3: Import hero styles**

Modify `src/styles/main.css` - add at top:

```css
@import './reset.css';
@import './variables.css';
@import './hero.css';
```

**Step 4: Create scroll animation utility**

Create `src/utils/scroll.js`:

```javascript
/**
 * Hero scroll-reveal animation
 * Phase 1 (0-40%): Text fades in
 * Phase 2 (60-100%): Everything fades out
 */
export function initHeroScrollAnimation() {
  const heroImage = document.querySelector('.hero-image');
  const heroText = document.querySelector('.hero-text');

  if (!heroImage || !heroText) return;

  function updateHeroOpacity() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const scrollProgress = scrollY / viewportHeight;

    // Phase 1: Text appears (0-40% scroll)
    if (scrollProgress < 0.4) {
      const textOpacity = Math.min(scrollProgress * 2.5, 1);
      heroText.style.opacity = textOpacity;
    }

    // Phase 2: Hero disappears (60-100% scroll)
    if (scrollProgress > 0.6) {
      const fadeProgress = (scrollProgress - 0.6) * 2.5;
      const opacity = Math.max(1 - fadeProgress, 0);
      heroImage.style.opacity = opacity;
      heroText.style.opacity = opacity;
    }
  }

  // Use requestAnimationFrame for smooth animation
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeroOpacity();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  updateHeroOpacity();
}
```

**Step 5: Initialize scroll animation**

Create `src/main.js`:

```javascript
import { initHeroScrollAnimation } from './utils/scroll.js';

// Initialize hero scroll animation
document.addEventListener('DOMContentLoaded', () => {
  initHeroScrollAnimation();
});
```

**Step 6: Test hero animation**

Run: `npm run dev`
Expected:
- Black screen with sock image
- Scroll down → text "Sockendynamik..." fades in
- Continue scrolling → sock and text fade out

**Step 7: Commit**

```bash
git add index.html src/styles/hero.css src/utils/scroll.js src/main.js src/styles/main.css
git commit -m "feat: implement hero section with scroll-reveal animation

- Fixed sock image on black background
- Text fades in at 20-40% scroll
- Hero fades out at 60-100% scroll
- Smooth GPU-accelerated animations

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Navigation Bar

**Files:**
- Create: `src/styles/navigation.css`
- Modify: `index.html`
- Modify: `src/main.js`
- Modify: `src/styles/main.css`

**Step 1: Add navigation HTML**

Modify `index.html` - add after `<body>` opening tag:

```html
<body>
  <!-- Navigation -->
  <nav id="nav" class="nav">
    <div class="nav-container">
      <a href="#teil-a" class="nav-link">Teil A</a>
      <a href="#teil-b" class="nav-link">Teil B</a>
      <a href="#teil-c" class="nav-link">Teil C</a>
      <a href="#teil-d" class="nav-link">Teil D</a>
      <a href="#zeichnungen" class="nav-link">Zeichnungen</a>
    </div>
  </nav>

  <!-- Hero Section -->
  <!-- ... rest of HTML ... -->
```

**Step 2: Create navigation styles**

Create `src/styles/navigation.css`:

```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 100;
  opacity: 0;
  transform: translateY(-100%);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.nav.visible {
  opacity: 1;
  transform: translateY(0);
}

.nav-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--padding);
  max-width: var(--max-width);
  margin: 0 auto;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.nav-link {
  color: var(--color-white);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  padding: var(--space-xs) var(--space-sm);
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  color: var(--color-red-primary);
}

@media (min-width: 768px) {
  .nav-link {
    font-size: 16px;
  }
}
```

**Step 3: Import navigation styles**

Modify `src/styles/main.css` - add import:

```css
@import './navigation.css';
```

**Step 4: Add navigation visibility logic**

Modify `src/main.js`:

```javascript
import { initHeroScrollAnimation } from './utils/scroll.js';

// Show navigation after hero
function initNavigation() {
  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');

  if (!nav || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      // Show nav when hero is no longer visible
      if (!entry.isIntersecting) {
        nav.classList.add('visible');
      } else {
        nav.classList.remove('visible');
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(hero);
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initHeroScrollAnimation();
  initNavigation();
});
```

**Step 5: Test navigation**

Run: `npm run dev`
Expected:
- Navigation hidden initially
- Scroll past hero → navigation appears at top
- Scroll back up → navigation hides

**Step 6: Commit**

```bash
git add index.html src/styles/navigation.css src/main.js src/styles/main.css
git commit -m "feat: add sticky navigation with smooth reveal

- Fixed navigation bar with blur effect
- Shows after hero section scrolls away
- Smooth links to sections (A, B, C, D, Zeichnungen)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: CSV Parser & Data Aggregation

**Files:**
- Create: `src/utils/csv-parser.js`
- Create: `public/data.csv` (placeholder)

**Step 1: Create placeholder CSV**

Create `public/data.csv`:

```csv
teilnehmer_id,alter,geschlecht,befindlichkeit_vorher,frage_a1,frage_a2,frage_a3,frage_a4,frage_a5,frage_a6,frage_a7,frage_b1,frage_b2,frage_b3,frage_b4,frage_b5,frage_b6,frage_b7,frage_b8,frage_b9,frage_c1,frage_c2,frage_c3,frage_c4,frage_c5,frage_c6,frage_c7,abschiedsbrief,zeichnung_datei
1,25,m,Leicht positiv aktiviert,4,3,5,2,4,3,4,0,1,0,1,0,1,0,0,1,2,0,1,3,2,1,3,"Liebe Socke, du warst immer für mich da.",drawing_001.jpg
2,31,w,Deutlich positiv aktiviert,5,5,4,4,5,2,5,1,0,1,0,1,1,1,1,0,1,1,0,2,1,0,2,"Ich vermisse dich jeden Tag.",drawing_002.jpg
3,28,d,Leicht irritiert,3,2,3,3,3,4,2,0,1,0,1,0,0,1,0,1,0,1,1,1,3,1,1,"Du fehlst mir so sehr.",drawing_003.jpg
```

Note: This is test data. Will be replaced with real data later.

**Step 2: Create CSV parser**

Create `src/utils/csv-parser.js`:

```javascript
import Papa from 'papaparse';

/**
 * Load and parse CSV data
 * @param {string} url - Path to CSV file
 * @returns {Promise<Object>} Parsed and aggregated data
 */
export async function loadAndParseData(url = '/data.csv') {
  try {
    const response = await fetch(url);
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
    })).sort((a, b) => b.count - a.count); // Sort by count descending
  });
}
```

**Step 3: Test CSV loading**

Modify `src/main.js` to test data loading:

```javascript
import { initHeroScrollAnimation } from './utils/scroll.js';
import { loadAndParseData } from './utils/csv-parser.js';

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  initHeroScrollAnimation();
  initNavigation();

  // Load data
  try {
    const data = await loadAndParseData();
    console.log('Loaded data:', data);
    window.studyData = data; // Store globally for now
  } catch (error) {
    console.error('Failed to load data:', error);
  }
});

// Show navigation after hero
function initNavigation() {
  // ... (previous code)
}
```

**Step 4: Test data loading**

Run: `npm run dev`
Expected: Console shows "Loaded data:" with aggregated object containing teilA, teilB, etc.

**Step 5: Commit**

```bash
git add src/utils/csv-parser.js public/data.csv src/main.js
git commit -m "feat: add CSV parser with data aggregation

- PapaParse integration for CSV loading
- Calculate median/mean for Likert scales
- Count frequencies for multiple choice
- Store aggregated data globally

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Teil A - Likert Scale Visualizations

**Files:**
- Create: `src/visualizations/likert-scale.js`
- Create: `src/styles/visualizations.css`
- Modify: `index.html`
- Modify: `src/main.js`
- Modify: `src/styles/main.css`

**Step 1: Add Teil A section to HTML**

Modify `index.html` - add after hero section:

```html
<!-- Main Content -->
<div class="container">
  <!-- Teil A -->
  <section id="teil-a" class="section">
    <div class="section-header">
      <h2>Teil A</h2>
      <p>Emotionale Bindung zu Socken (nie → immer)</p>
    </div>
    <div id="teil-a-content" class="visualizations"></div>
  </section>
</div>
```

**Step 2: Create visualization styles**

Create `src/styles/visualizations.css`:

```css
.visualizations {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.visualization-card {
  background: var(--color-white);
  border-radius: 12px;
  padding: var(--space-md);
  box-shadow: var(--shadow-sm);
}

.visualization-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-gray-800);
  margin-bottom: var(--space-md);
  line-height: 1.4;
}

/* Likert Scale */
.likert-scale {
  position: relative;
  width: 100%;
  padding: var(--space-md) 0;
}

.likert-line {
  position: relative;
  height: 2px;
  background: var(--color-gray-200);
  margin: var(--space-sm) 0;
}

.likert-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-gray-600);
  margin-top: var(--space-xs);
}

.likert-markers {
  position: relative;
  height: 40px;
}

.likert-marker {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  top: 20px;
}

.likert-marker.median {
  background: var(--color-red-primary);
  border: 2px solid var(--color-white);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.likert-marker.mean {
  background: var(--color-red-dark);
  border: 2px solid var(--color-white);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.likert-legend {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-sm);
  font-size: 12px;
  color: var(--color-gray-600);
}

.likert-legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.likert-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.likert-legend-dot.median {
  background: var(--color-red-primary);
}

.likert-legend-dot.mean {
  background: var(--color-red-dark);
}

@media (min-width: 768px) {
  .visualization-title {
    font-size: 18px;
  }

  .likert-labels {
    font-size: 14px;
  }
}
```

**Step 3: Import visualization styles**

Modify `src/styles/main.css`:

```css
@import './visualizations.css';
```

**Step 4: Create Likert scale renderer**

Create `src/visualizations/likert-scale.js`:

```javascript
/**
 * Likert scale questions for Teil A
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

/**
 * Render Likert scale visualization
 * @param {string} containerId - ID of container element
 * @param {Array} data - Array of {median, mean} objects
 */
export function renderLikertScales(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  data.forEach((item, index) => {
    const card = createLikertCard(TEIL_A_QUESTIONS[index], item.median, item.mean);
    container.appendChild(card);
  });
}

/**
 * Create a single Likert scale card
 * @param {string} question - Question text
 * @param {number} median - Median value (1-5)
 * @param {number} mean - Mean value (1-5)
 * @returns {HTMLElement}
 */
function createLikertCard(question, median, mean) {
  const card = document.createElement('div');
  card.className = 'visualization-card';

  card.innerHTML = `
    <div class="visualization-title">${question}</div>
    <div class="likert-scale">
      <div class="likert-line"></div>
      <div class="likert-markers">
        <div class="likert-marker median" style="left: ${((median - 1) / 4) * 100}%"></div>
        <div class="likert-marker mean" style="left: ${((mean - 1) / 4) * 100}%"></div>
      </div>
      <div class="likert-labels">
        <span>nie</span>
        <span>selten</span>
        <span>manchmal</span>
        <span>oft</span>
        <span>immer</span>
      </div>
      <div class="likert-legend">
        <div class="likert-legend-item">
          <div class="likert-legend-dot median"></div>
          <span>Median: ${median}</span>
        </div>
        <div class="likert-legend-item">
          <div class="likert-legend-dot mean"></div>
          <span>Durchschnitt: ${mean}</span>
        </div>
      </div>
    </div>
  `;

  return card;
}
```

**Step 5: Integrate Likert scales into main app**

Modify `src/main.js`:

```javascript
import { initHeroScrollAnimation } from './utils/scroll.js';
import { loadAndParseData } from './utils/csv-parser.js';
import { renderLikertScales } from './visualizations/likert-scale.js';

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  initHeroScrollAnimation();
  initNavigation();

  // Load and render data
  try {
    const data = await loadAndParseData();
    console.log('Loaded data:', data);

    // Render Teil A
    renderLikertScales('teil-a-content', data.teilA);

  } catch (error) {
    console.error('Failed to load data:', error);
    showError('Fehler beim Laden der Daten. Bitte später erneut versuchen.');
  }
});

// Show error message
function showError(message) {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `<div class="error">${message}</div>`;
  }
}

// Show navigation after hero
function initNavigation() {
  // ... (previous code)
}
```

**Step 6: Test Likert scales**

Run: `npm run dev`
Expected:
- Scroll past hero
- See "Teil A" section with 7 Likert scales
- Each scale shows median and mean markers
- Labels: nie, selten, manchmal, oft, immer

**Step 7: Commit**

```bash
git add index.html src/visualizations/likert-scale.js src/styles/visualizations.css src/main.js src/styles/main.css
git commit -m "feat: add Teil A Likert scale visualizations

- Render 7 Likert scales with median/mean markers
- Clean card design with shadows
- Responsive layout with proper spacing
- Question text above each scale

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Teil B & C - Bar Chart Visualizations

**Files:**
- Create: `src/visualizations/bar-chart.js`
- Modify: `index.html`
- Modify: `src/main.js`
- Modify: `src/styles/visualizations.css`

**Step 1: Add Teil B & C sections to HTML**

Modify `index.html` - add after Teil A:

```html
<!-- Teil B -->
<section id="teil-b" class="section">
  <div class="section-header">
    <h2>Teil B</h2>
    <p>Entscheidungspräferenzen</p>
  </div>
  <div id="teil-b-content" class="visualizations"></div>
</section>

<!-- Teil C -->
<section id="teil-c" class="section">
  <div class="section-header">
    <h2>Teil C</h2>
    <p>Sockenpräferenzen & Verhalten</p>
  </div>
  <div id="teil-c-content" class="visualizations"></div>
</section>
```

**Step 2: Add bar chart styles**

Modify `src/styles/visualizations.css` - add at end:

```css
/* Bar Charts */
.bar-chart {
  width: 100%;
}

.bar-chart-item {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.bar-label {
  flex: 0 0 40%;
  font-size: 14px;
  color: var(--color-gray-800);
  padding-right: var(--space-sm);
  text-align: right;
}

.bar-container {
  flex: 1;
  background: var(--color-gray-100);
  height: 32px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  background: var(--color-red-primary);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: var(--space-xs);
  transition: width 0.6s ease-out;
  width: 0; /* Start at 0 for animation */
}

.bar-fill.animate {
  width: var(--bar-width);
}

.bar-percentage {
  color: var(--color-white);
  font-size: 12px;
  font-weight: 600;
}

@media (min-width: 768px) {
  .bar-label {
    font-size: 16px;
  }

  .bar-percentage {
    font-size: 14px;
  }
}
```

**Step 3: Create bar chart renderer**

Create `src/visualizations/bar-chart.js`:

```javascript
/**
 * Questions for Teil B
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
 * Questions for Teil C
 */
const TEIL_C_QUESTIONS = [
  { title: 'Bevorzugte Sockenlänge:', options: ['Keine Socken', 'No-Show', 'Knöchellänge', 'Mittlere Länge', 'Knielang', 'Situationsabhängig'] },
  { title: 'Falt-/Lagerungsstrategie:', options: ['Überlappungsfaltung', 'Kompressionsbasierte Bündelung', 'Lineare Parallelfaltung', 'Unstrukturierte Ablage'] },
  { title: 'Farbkategorie:', options: ['Achromatische Töne', 'Gedämpfte Chromatik', 'Helle/kontrastreiche Farben', 'Situationsabhängig'] },
  { title: 'Textile Oberflächenpräferenz:', options: ['Überwiegend unifarben', 'Gelegentlich gemustert', 'Überwiegend gemustert', 'Muster als Identitätsmerkmal'] },
  { title: 'Affektive Veränderung bei gemusterten Socken:', options: ['Stimmungsaufhellung', 'Erhöhte Selbstwirksamkeit', 'Keine Veränderung', 'Keine Angabe'] },
  { title: 'Reaktion auf veränderte Sockenschublade:', options: ['Keine Reaktion', 'Kurzfristige Irritation', 'Wahrnehmbarer Ordnungsimpuls', 'Deutliche Dysregulation'] }
];

/**
 * Render horizontal bar charts
 * @param {string} containerId - Container element ID
 * @param {Array} data - Aggregated data array
 * @param {Array} questions - Question metadata
 */
export function renderBarCharts(containerId, data, questions) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  data.forEach((frequencies, index) => {
    if (!frequencies || frequencies.length === 0) return;

    const questionData = questions[index];
    const card = createBarChartCard(questionData.title, frequencies, questionData.options);
    container.appendChild(card);
  });

  // Trigger animations after render
  setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach(bar => {
      bar.classList.add('animate');
    });
  }, 100);
}

/**
 * Create a single bar chart card
 * @param {string} title - Question title
 * @param {Array} frequencies - Array of {option, count, percentage}
 * @param {Array} optionLabels - Human-readable labels
 * @returns {HTMLElement}
 */
function createBarChartCard(title, frequencies, optionLabels) {
  const card = document.createElement('div');
  card.className = 'visualization-card';

  let barsHTML = frequencies.map(freq => {
    const label = optionLabels[freq.option] || `Option ${freq.option}`;
    return `
      <div class="bar-chart-item">
        <div class="bar-label">${label}</div>
        <div class="bar-container">
          <div class="bar-fill" style="--bar-width: ${freq.percentage}%">
            <span class="bar-percentage">${freq.percentage}%</span>
          </div>
        </div>
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
```

**Step 4: Integrate bar charts into main app**

Modify `src/main.js`:

```javascript
import { initHeroScrollAnimation } from './utils/scroll.js';
import { loadAndParseData } from './utils/csv-parser.js';
import { renderLikertScales } from './visualizations/likert-scale.js';
import { renderBarCharts, TEIL_B_QUESTIONS, TEIL_C_QUESTIONS } from './visualizations/bar-chart.js';

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  initHeroScrollAnimation();
  initNavigation();

  // Load and render data
  try {
    const data = await loadAndParseData();
    console.log('Loaded data:', data);

    // Render visualizations
    renderLikertScales('teil-a-content', data.teilA);
    renderBarCharts('teil-b-content', data.teilB, TEIL_B_QUESTIONS);
    renderBarCharts('teil-c-content', data.teilC, TEIL_C_QUESTIONS);

  } catch (error) {
    console.error('Failed to load data:', error);
    showError('Fehler beim Laden der Daten. Bitte später erneut versuchen.');
  }
});

// ... rest of code
```

**Step 5: Test bar charts**

Run: `npm run dev`
Expected:
- Scroll to Teil B: See horizontal bar charts with animated bars
- Scroll to Teil C: See more bar charts
- Bars animate from left to right
- Percentages shown on red bars

**Step 6: Commit**

```bash
git add index.html src/visualizations/bar-chart.js src/main.js src/styles/visualizations.css
git commit -m "feat: add Teil B & C horizontal bar chart visualizations

- Render frequency distributions as horizontal bars
- Animated bars with smooth transitions
- Sorted by frequency (highest first)
- Percentage labels on bars

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Teil D - Drawing Slideshow

**Files:**
- Create: `src/visualizations/slideshow.js`
- Create: `src/styles/slideshow.css`
- Create: `public/drawings/` (directory for drawings)
- Modify: `index.html`
- Modify: `src/main.js`
- Modify: `src/styles/main.css`

**Step 1: Create drawings directory with placeholders**

```bash
mkdir -p public/drawings
# Placeholder images will be added later
```

**Step 2: Add slideshow section to HTML**

Modify `index.html` - add after Teil C:

```html
<!-- Teil D - Zeichnungen -->
<section id="zeichnungen" class="section section-dark">
  <div class="section-header">
    <h2>Zeichnungen</h2>
    <p>Präferierte Socken der Teilnehmer</p>
  </div>
  <div id="slideshow-container" class="slideshow-container"></div>
</section>
```

**Step 3: Create slideshow styles**

Create `src/styles/slideshow.css`:

```css
.section-dark {
  background-color: var(--color-black);
  color: var(--color-white);
  margin: 0;
  padding: var(--space-xl) var(--padding);
}

.section-dark .section-header h2 {
  color: var(--color-white);
}

.section-dark .section-header p {
  color: var(--color-gray-200);
}

.slideshow-container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.swiper {
  width: 100%;
  padding-bottom: var(--space-lg);
}

.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-black);
}

.swiper-slide img {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
}

.swiper-button-next,
.swiper-button-prev {
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.1);
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.swiper-button-next:after,
.swiper-button-prev:after {
  font-size: 20px;
}

.swiper-pagination {
  color: var(--color-white);
}

.swiper-pagination-bullet {
  background: var(--color-white);
  opacity: 0.5;
}

.swiper-pagination-bullet-active {
  opacity: 1;
  background: var(--color-red-primary);
}

.slideshow-empty {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-gray-600);
}

@media (min-width: 768px) {
  .swiper-slide img {
    max-height: 70vh;
  }
}
```

**Step 4: Import slideshow styles**

Modify `src/styles/main.css`:

```css
@import './slideshow.css';
```

**Step 5: Create slideshow component**

Create `src/visualizations/slideshow.js`:

```javascript
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * Render drawing slideshow
 * @param {string} containerId - Container element ID
 * @param {Array} drawings - Array of image filenames
 */
export function renderSlideshow(containerId, drawings) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!drawings || drawings.length === 0) {
    container.innerHTML = '<div class="slideshow-empty">Keine Zeichnungen verfügbar</div>';
    return;
  }

  // Create swiper HTML
  const slidesHTML = drawings.map(filename => `
    <div class="swiper-slide">
      <img src="/drawings/${filename}" alt="Teilnehmer Zeichnung" loading="lazy">
    </div>
  `).join('');

  container.innerHTML = `
    <div class="swiper">
      <div class="swiper-wrapper">
        ${slidesHTML}
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
      <div class="swiper-pagination"></div>
    </div>
  `;

  // Initialize Swiper
  new Swiper('.swiper', {
    modules: [Navigation, Pagination],
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
    },
    loop: true,
    keyboard: {
      enabled: true,
    },
    lazy: true,
  });
}
```

**Step 6: Integrate slideshow into main app**

Modify `src/main.js`:

```javascript
import { renderSlideshow } from './visualizations/slideshow.js';

// In DOMContentLoaded:
document.addEventListener('DOMContentLoaded', async () => {
  // ... previous code ...

  // Load and render data
  try {
    const data = await loadAndParseData();

    renderLikertScales('teil-a-content', data.teilA);
    renderBarCharts('teil-b-content', data.teilB, TEIL_B_QUESTIONS);
    renderBarCharts('teil-c-content', data.teilC, TEIL_C_QUESTIONS);
    renderSlideshow('slideshow-container', data.zeichnungen);

  } catch (error) {
    // ... error handling
  }
});
```

**Step 7: Test slideshow**

Run: `npm run dev`
Expected:
- Scroll to "Zeichnungen" section (black background)
- See swiper with navigation arrows
- Can swipe/click to navigate
- Shows "Keine Zeichnungen verfügbar" if no images

**Step 8: Commit**

```bash
git add src/visualizations/slideshow.js src/styles/slideshow.css src/main.js src/styles/main.css index.html
git commit -m "feat: add drawing slideshow with Swiper.js

- Touch-enabled slideshow for participant drawings
- Navigation arrows and pagination
- Lazy loading for performance
- Black background for gallery feel

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Offene Fragen - Text Lists

**Files:**
- Create: `src/visualizations/text-list.js`
- Modify: `index.html`
- Modify: `src/main.js`
- Modify: `src/styles/visualizations.css`

**Step 1: Add Teil D text section to HTML**

Modify `index.html` - add after slideshow section:

```html
<!-- Teil D - Abschiebsbriefe -->
<section id="teil-d" class="section">
  <div class="section-header">
    <h2>Teil D</h2>
    <p>Abschiebsbriefe an verlorene Socken</p>
  </div>
  <div id="teil-d-content" class="text-list-container"></div>
</section>
```

**Step 2: Add text list styles**

Modify `src/styles/visualizations.css` - add at end:

```css
/* Text Lists */
.text-list-container {
  display: grid;
  gap: var(--space-md);
}

.text-card {
  background: var(--color-white);
  border-radius: 8px;
  padding: var(--space-md);
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--color-red-primary);
}

.text-card-content {
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-gray-800);
  font-style: italic;
  margin-bottom: var(--space-sm);
}

.text-card-author {
  font-size: 14px;
  color: var(--color-gray-600);
  text-align: right;
}

.text-list-empty {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-gray-600);
}

@media (min-width: 768px) {
  .text-list-container {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
}
```

**Step 3: Create text list renderer**

Create `src/visualizations/text-list.js`:

```javascript
/**
 * Render text list (e.g., goodbye letters)
 * @param {string} containerId - Container element ID
 * @param {Array} texts - Array of text strings
 * @param {string} title - Section title
 */
export function renderTextList(containerId, texts, title = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!texts || texts.length === 0) {
    container.innerHTML = '<div class="text-list-empty">Keine Einträge vorhanden</div>';
    return;
  }

  container.innerHTML = texts.map((text, index) => {
    return createTextCard(text, index + 1);
  }).join('');
}

/**
 * Create a single text card
 * @param {string} text - Text content
 * @param {number} index - Participant index
 * @returns {string} HTML string
 */
function createTextCard(text, index) {
  const sanitizedText = escapeHtml(text);

  return `
    <div class="text-card">
      <div class="text-card-content">"${sanitizedText}"</div>
      <div class="text-card-author">— Teilnehmer ${index}</div>
    </div>
  `;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Raw text
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

**Step 4: Integrate text list into main app**

Modify `src/main.js`:

```javascript
import { renderTextList } from './visualizations/text-list.js';

// In DOMContentLoaded:
document.addEventListener('DOMContentLoaded', async () => {
  // ... previous code ...

  try {
    const data = await loadAndParseData();

    renderLikertScales('teil-a-content', data.teilA);
    renderBarCharts('teil-b-content', data.teilB, TEIL_B_QUESTIONS);
    renderBarCharts('teil-c-content', data.teilC, TEIL_C_QUESTIONS);
    renderTextList('teil-d-content', data.abschiebsbriefe);
    renderSlideshow('slideshow-container', data.zeichnungen);

  } catch (error) {
    // ... error handling
  }
});
```

**Step 5: Test text lists**

Run: `npm run dev`
Expected:
- Scroll to Teil D section
- See cards with goodbye letters
- Cards have red left border
- Text is italic and quoted
- Author shown at bottom right

**Step 6: Commit**

```bash
git add src/visualizations/text-list.js index.html src/main.js src/styles/visualizations.css
git commit -m "feat: add text list for goodbye letters (Teil D)

- Card-based layout with quotes
- Red accent border on left
- Responsive grid on larger screens
- XSS protection with HTML escaping

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 10: Responsive Optimizations & Polish

**Files:**
- Modify: `src/styles/main.css`
- Modify: `src/styles/hero.css`
- Modify: `src/styles/navigation.css`

**Step 1: Add responsive utilities**

Modify `src/styles/main.css` - add at end:

```css
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

/* Loading state */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  color: var(--color-gray-600);
}

/* Smooth scroll for all sections */
html {
  scroll-padding-top: 60px; /* Account for fixed nav */
}

/* Focus styles for accessibility */
a:focus,
button:focus {
  outline: 2px solid var(--color-red-primary);
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .nav,
  .swiper-button-prev,
  .swiper-button-next {
    display: none;
  }
}
```

**Step 2: Improve mobile hero**

Modify `src/styles/hero.css` - update `.hero-text`:

```css
.hero-text {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--color-white);
  opacity: 0;
  transition: opacity 0.3s ease-out;
  z-index: 10;
  padding: 0 var(--padding);
  max-width: 90%; /* Prevent overflow on small screens */
}

.hero-text h1 {
  margin-bottom: var(--space-sm);
  font-size: clamp(24px, 5vw, 48px);
  word-wrap: break-word; /* Handle long words */
}
```

**Step 3: Improve navigation for small screens**

Modify `src/styles/navigation.css` - update `.nav-container`:

```css
.nav-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(12px, 3vw, 24px); /* Responsive gap */
  padding: var(--space-sm) var(--padding);
  max-width: var(--max-width);
  margin: 0 auto;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.nav-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.nav-link {
  color: var(--color-white);
  text-decoration: none;
  font-size: clamp(12px, 2.5vw, 16px);
  font-weight: 600;
  white-space: nowrap;
  padding: var(--space-xs) var(--space-sm);
  border-radius: 4px;
  transition: background-color 0.2s ease;
  flex-shrink: 0; /* Prevent shrinking */
}
```

**Step 4: Add loading state to app**

Modify `src/main.js` - update data loading:

```javascript
document.addEventListener('DOMContentLoaded', async () => {
  initHeroScrollAnimation();
  initNavigation();

  // Show loading state
  const app = document.querySelector('.container');
  if (app) {
    app.innerHTML = '<div class="loading">Lade Daten...</div>';
  }

  // Load and render data
  try {
    const data = await loadAndParseData();
    console.log('Loaded data:', data);

    // Clear loading state
    if (app) {
      app.querySelector('.loading')?.remove();
    }

    // Render all sections
    renderLikertScales('teil-a-content', data.teilA);
    renderBarCharts('teil-b-content', data.teilB, TEIL_B_QUESTIONS);
    renderBarCharts('teil-c-content', data.teilC, TEIL_C_QUESTIONS);
    renderTextList('teil-d-content', data.abschiebsbriefe);
    renderSlideshow('slideshow-container', data.zeichnungen);

  } catch (error) {
    console.error('Failed to load data:', error);
    showError('Fehler beim Laden der Daten. Bitte später erneut versuchen.');
  }
});

function showError(message) {
  const app = document.querySelector('.container');
  if (app) {
    app.innerHTML = `<div class="error">${message}</div>`;
  }
}
```

**Step 5: Test responsive behavior**

Run: `npm run dev`
Test:
- Mobile (375px): All content fits, nav scrolls horizontally
- Tablet (768px): Larger fonts, better spacing
- Desktop (1200px+): Max-width applied, centered content

**Step 6: Commit**

```bash
git add src/styles/main.css src/styles/hero.css src/styles/navigation.css src/main.js
git commit -m "feat: add responsive optimizations and polish

- Responsive utilities and accessibility improvements
- Mobile-friendly navigation with horizontal scroll
- Loading and error states
- Better text wrapping on small screens
- Print styles

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 11: Performance Optimizations

**Files:**
- Modify: `vite.config.js`
- Modify: `index.html`

**Step 1: Optimize Vite build config**

Modify `vite.config.js`:

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['papaparse'],
          'charts': ['chart.js'],
          'swiper': ['swiper']
        }
      }
    }
  }
})
```

**Step 2: Add meta tags for performance**

Modify `index.html` - add in `<head>`:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Ergebnisse der Sockendynamik- und Paarbindungsinventar Studie">
  <meta name="theme-color" content="#000000">

  <!-- Preconnect for performance -->
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>

  <!-- Preload critical assets -->
  <link rel="preload" href="/Socke_Bild.jpeg" as="image">

  <title>Sockendynamik- und Paarbindungsinventar - Ergebnisse</title>
  <link rel="stylesheet" href="/src/styles/main.css">
</head>
```

**Step 3: Test build**

Run: `npm run build`
Expected:
- `dist/` folder created
- JavaScript split into chunks (vendor, charts, swiper)
- CSS minified
- Assets optimized

Run: `npm run preview`
Expected: Production build runs smoothly

**Step 4: Commit**

```bash
git add vite.config.js index.html
git commit -m "feat: add performance optimizations

- Code splitting for vendor libraries
- Remove console.logs in production
- Preload critical assets
- Minify and optimize build output

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 12: Documentation & README

**Files:**
- Create: `README.md`
- Modify: `CLAUDE.md`

**Step 1: Create comprehensive README**

Create `README.md`:

```markdown
# Sockendynamik- und Paarbindungsinventar - Ergebnisse Website

Satirische Studien-Visualisierungsseite für das "Sockendynamik- und Paarbindungsinventar" des Klinischen Instituts für Textile Objektbeziehungen (KITO).

## Features

- 📊 Interaktive Datenvisualisierungen (Likert-Skalen, Balkendiagramme)
- 🎨 Apple-ähnliches, minimalistisches Design
- 📱 Mobile-First & vollständig responsive
- ✨ Scroll-basierte Animationen
- 🖼️ Swipe-fähige Bildergalerie für Zeichnungen
- ⚡ Optimiert für Performance

## Tech Stack

- **Vite** - Build-Tool & Dev-Server
- **Vanilla JavaScript (ES6+)** - Kein Framework
- **Chart.js** - Diagramm-Visualisierungen
- **Swiper.js** - Touch-Slideshow
- **PapaParse** - CSV-Parsing
- **CSS3** - Modern CSS mit Custom Properties

## Projekt-Struktur

```
socken_befragung/
├── public/
│   ├── Socke_Bild.jpeg       # Hero-Bild
│   ├── data.csv              # Fragebogen-Ergebnisse
│   └── drawings/             # Teilnehmer-Zeichnungen
├── src/
│   ├── main.js               # App-Einstieg
│   ├── styles/               # CSS-Dateien
│   ├── utils/                # Utilities (CSV-Parser, Scroll)
│   └── visualizations/       # Visualisierungs-Module
├── docs/
│   └── plans/                # Design & Implementation Docs
├── index.html
├── package.json
└── vite.config.js
```

## Installation

```bash
# Dependencies installieren
npm install

# Dev-Server starten
npm run dev

# Production Build
npm run build

# Production Preview
npm run preview
```

## Daten aktualisieren

1. CSV-Datei vorbereiten mit korrekten Spalten (siehe `public/data.csv`)
2. Datei nach `public/data.csv` kopieren
3. Zeichnungen nach `public/drawings/` kopieren
4. Build neu erstellen: `npm run build`

## CSV Format

Erwartete Spalten:
- `teilnehmer_id`, `alter`, `geschlecht`
- `frage_a1` bis `frage_a7` (Likert 1-5)
- `frage_b1` bis `frage_b9` (Multiple Choice 0-1)
- `frage_c1` bis `frage_c7` (Multiple Choice 0-5)
- `abschiedsbrief` (Text)
- `zeichnung_datei` (Dateiname)

## Deployment

Die Website kann auf allen statischen Hosting-Diensten deployed werden:

- **Netlify**: Drag & Drop `dist/` Ordner
- **Vercel**: GitHub-Integration
- **GitHub Pages**: `dist/` Ordner publishen

## Design-Prinzipien

- **Mobile-First**: Optimiert für Handy-Nutzung
- **Apple-Style**: Clean, minimal, elegant
- **Performance**: < 100KB JavaScript, schnelle Ladezeiten
- **Accessibility**: Keyboard-Navigation, ARIA-Labels

## Browser-Support

- Chrome/Edge (letzte 2 Versionen)
- Firefox (letzte 2 Versionen)
- Safari (letzte 2 Versionen)
- Mobile Safari/Chrome

## Lizenz

Alle Faserrechte vorbehalten © 2026 KITO
```

**Step 2: Update CLAUDE.md**

Modify `CLAUDE.md`:

```markdown
# Sockendynamik-Website

Satirische Studien-Visualisierungsseite für "Sockendynamik- und Paarbindungsinventar" (KITO).

## Projekt-Status

✅ Implementierung abgeschlossen
- Hero-Section mit Scroll-Reveal
- Navigation
- Alle Visualisierungen (Teil A-D)
- Zeichnungs-Slideshow
- Responsive Design
- Performance-Optimierungen

## Tech-Stack
- Vite + Vanilla JavaScript (kein Framework - Apple-Stil)
- Chart.js für Visualisierungen
- Swiper.js für Zeichnungs-Slideshow
- PapaParse für CSV-Parsing

## Wichtige Befehle
```bash
npm run dev      # Dev-Server
npm run build    # Production Build
npm run preview  # Preview Build
```

## Wichtige Dateien
- `docs/plans/2026-02-22-socken-website-design.md` - Design-Dokument
- `docs/plans/2026-02-22-socken-website-implementation.md` - Implementation Plan
- `public/data.csv` - Fragebogen-Ergebnisse (CSV mit echter Daten ersetzen)
- `public/Socke_Bild.jpeg` - Hero-Image
- `Studie.pdf` - Original-Fragebogen

## Nächste Schritte
1. Echte CSV-Daten einfügen (`public/data.csv`)
2. Teilnehmer-Zeichnungen hinzufügen (`public/drawings/`)
3. Build erstellen: `npm run build`
4. Deployment (User kümmert sich um Hosting & Domain)

## Design-Prinzipien
- Mobile-First
- Apple-ähnlich: clean, minimal, schlicht
- Schwarz/Weiß/Grau mit roten Akzenten
- Scroll-basierte Animationen
```

**Step 3: Test documentation**

Run: `npm run dev`
Verify: All sections work as documented

**Step 4: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: add comprehensive README and update CLAUDE.md

- Complete setup and usage instructions
- CSV format documentation
- Deployment guide
- Project structure overview

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Final Verification

**Step 1: Run full build**

```bash
npm run build
npm run preview
```

**Step 2: Manual testing checklist**

- [ ] Hero image loads and animates on scroll
- [ ] Text appears at 20-40% scroll
- [ ] Hero fades out at 60-100% scroll
- [ ] Navigation appears after hero
- [ ] All navigation links work
- [ ] Teil A: 7 Likert scales render
- [ ] Teil B: 9 bar charts render
- [ ] Teil C: 6-7 bar charts render
- [ ] Teil D: Text cards render
- [ ] Zeichnungen: Slideshow works (or shows empty state)
- [ ] Mobile responsive (test at 375px)
- [ ] Tablet responsive (test at 768px)
- [ ] Desktop responsive (test at 1200px+)

**Step 3: Performance check**

- Open DevTools → Lighthouse
- Run audit
- Target: Performance > 90, Accessibility > 90

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final verification and testing

- All features tested and working
- Performance optimized
- Ready for deployment

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Plan Complete

The website is now fully implemented with:

✅ Apple-style hero with scroll animations
✅ Sticky navigation
✅ CSV data loading and aggregation
✅ Likert scale visualizations (Teil A)
✅ Horizontal bar charts (Teil B & C)
✅ Text lists for open questions (Teil D)
✅ Touch-enabled drawing slideshow
✅ Mobile-first responsive design
✅ Performance optimizations
✅ Comprehensive documentation

**Next Steps:**
1. Replace `public/data.csv` with real study data
2. Add participant drawings to `public/drawings/`
3. Run `npm run build`
4. Deploy to hosting service
