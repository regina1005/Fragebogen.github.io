# Sockendynamik-Website - Design-Dokument

**Datum:** 2026-02-22
**Projekt:** Satirische Studien-Ergebnisseite für "Sockendynamik- und Paarbindungsinventar"
**Ziel:** Apple-ähnliche, mobile-optimierte Website zur Visualisierung der Fragebogen-Ergebnisse

---

## Überblick

Eine moderne, minimalistische Website die Ergebnisse einer satirischen Studie über die emotionale Beziehung zu Socken visualisiert. Die Seite präsentiert quantitative und qualitative Daten aus einem Fragebogen mit verschiedenen Visualisierungen im Apple-Stil.

**Kernmerkmale:**
- Mobile-First Design
- Apple-ähnliches, minimalistisches UI
- Scroll-basierte Animationen
- Interaktive Datenvisualisierungen
- Statische Website (keine Backend-Logik)

---

## 1. Technische Architektur

### Tech-Stack

**Core:**
- **Vite** - Build-Tool & Dev-Server
- **Vanilla JavaScript (ES6+)** - Keine Frameworks (wie Apple)
- **CSS3** - Mit Custom Properties für Theming

**Libraries:**
- **Chart.js** - Diagramm-Visualisierungen
- **Swiper.js** - Touch-fähige Slideshow für Zeichnungen
- **PapaParse** - CSV-Parsing

### Projektstruktur

```
socken_befragung/
├── index.html
├── public/
│   ├── Socke_Bild.jpeg          # Hero-Image
│   ├── drawings/                # Teilnehmer-Zeichnungen
│   │   ├── drawing_001.jpg
│   │   ├── drawing_002.jpg
│   │   └── ...
│   └── data.csv                 # Fragebogen-Ergebnisse
├── src/
│   ├── main.js                  # App-Einstiegspunkt
│   ├── styles/
│   │   ├── main.css             # Globale Styles
│   │   ├── hero.css             # Hero-Section
│   │   ├── navigation.css       # Navigation
│   │   └── sections.css         # Ergebnis-Sections
│   ├── utils/
│   │   ├── csv-parser.js        # CSV laden & verarbeiten
│   │   └── scroll.js            # Scroll-Animationen
│   └── visualizations/
│       ├── likert-scale.js      # Skalen (Teil A)
│       ├── bar-chart.js         # Balkendiagramme (Teil B/C)
│       ├── slideshow.js         # Zeichnungs-Slideshow
│       └── text-list.js         # Scrollbare Textlisten
├── package.json
└── vite.config.js
```

---

## 2. Komponenten & Layout

### Navigation (Sticky Header)

- **Position:** Fixiert oben, erscheint nach Hero-Section
- **Links:** Teil A | Teil B | Teil C | Teil D | Zeichnungen
- **Verhalten:**
  - Smooth-Scroll zu Sections
  - Active-State für aktuelle Section
- **Styling:** Minimalistisch, transparenter Hintergrund, weiße Schrift

### Hero-Section (Scroll-Reveal)

**3-Phasen Animation:**

1. **Initial (0% Scroll):**
   - Fullscreen Socke (Socke_Bild.jpeg)
   - Schwarzer Hintergrund
   - Kein Text

2. **Phase 1 (20-40% Scroll):**
   - Text "Sockendynamik- und Paarbindungsinventar - Ergebnisse" faded ein
   - Zentriert über der Socke
   - Opacity: 0 → 1

3. **Phase 2 (60-100% Scroll):**
   - Socke + Text faden aus
   - Opacity: 1 → 0
   - Erste Content-Section wird sichtbar

### Section-Layout

**Allgemeine Struktur:**
```
┌─────────────────────────────────┐
│   TEIL [A-D]                    │  ← Section-Header (groß, bold)
│   Kurzbeschreibung              │  ← Optional
├─────────────────────────────────┤
│   [Visualisierung 1]            │
│   [Visualisierung 2]            │
│   ...                           │
└─────────────────────────────────┘
```

**Mobile:**
- Volle Breite mit Padding (16-24px)
- Vertikal gestapelte Charts
- Touch-friendly Interaktionen

**Desktop:**
- Max-Width: 1200px (zentriert)
- Padding: 64px
- Größere Abstände zwischen Visualisierungen

---

## 3. Datenfluss & CSV-Verarbeitung

### CSV-Struktur (erwartet)

```csv
teilnehmer_id,alter,geschlecht,frage_a1,frage_a2,frage_a3,...,abschiedsbrief,zeichnung_datei
1,25,m,4,3,5,...,"Liebe Socke, du warst...",drawing_001.jpg
2,31,w,5,5,4,...,"Ich vermisse dich...",drawing_002.jpg
```

**Spalten:**
- Demografische Daten: `teilnehmer_id`, `alter`, `geschlecht`
- Teil A (Likert 1-5): `frage_a1` bis `frage_a7`
- Teil B (Binär): `frage_b1` bis `frage_b9`
- Teil C (Multiple Choice): `frage_c1` bis `frage_c7`
- Teil D (Qualitativ): `abschiedsbrief`, `zeichnung_datei`, etc.

### Daten-Pipeline

```
1. App-Start
   ↓
2. fetch('public/data.csv')
   ↓
3. PapaParse → Array of Objects
   ↓
4. Daten aggregieren:
   - Median & Durchschnitt (Teil A)
   - Häufigkeiten zählen (Teil B/C)
   - Texte sammeln (Qualitative Fragen)
   - Zeichnungs-Pfade extrahieren
   ↓
5. An Visualisierungs-Module übergeben
   ↓
6. Charts & Listen rendern
```

### Berechnungen

**Likert-Skalen (Teil A):**
- Werte: nie=1, selten=2, manchmal=3, oft=4, immer=5
- **Median:** Mittlerer Wert der sortierten Antworten
- **Durchschnitt:** Arithmetisches Mittel
- Beide werden als Marker auf der Skala dargestellt

**Multiple-Choice (Teil B/C):**
- Absolute Häufigkeiten zählen
- In Prozent umrechnen
- Nach Häufigkeit sortieren (absteigend)

**Error-Handling:**
- Fallback bei CSV-Ladefehler
- Leere/ungültige Werte überspringen
- Benutzerfreundliche Fehlermeldung

---

## 4. Scroll-Interaktionen & Animationen

### Hero Scroll-Reveal

**Implementierung:**
```javascript
window.addEventListener('scroll', () => {
  const scrollProgress = window.scrollY / window.innerHeight;

  // Phase 1: Text erscheint (0-40%)
  if (scrollProgress < 0.4) {
    titleOpacity = scrollProgress * 2.5;
  }

  // Phase 2: Hero verschwindet (60-100%)
  if (scrollProgress > 0.6) {
    heroOpacity = 1 - ((scrollProgress - 0.6) * 2.5);
  }
});
```

### Weitere Animationen

**Section Fade-In:**
- Intersection Observer
- Fade-in wenn Section in Viewport
- Einmalig pro Section

**Chart Animationen:**
- Balken animieren beim ersten Erscheinen
- Chart.js built-in Animationen
- Delay zwischen Balken für gestaffelten Effekt

**Navigation:**
- `scroll-behavior: smooth` in CSS
- Active Section Highlighting
- Smooth transitions

### Performance-Optimierungen

- `requestAnimationFrame` für flüssige Animationen
- CSS `transform` & `opacity` (GPU-beschleunigt)
- Debouncing für Scroll-Events
- Passive Event Listeners

---

## 5. Visualisierungen

### Teil A - Likert-Skalen

**Design:**
```
Frage: Ich empfinde eine tiefe Loyalität...

nie ●━━━━━●━━━━━━●━━━━━━━━━━━━━━━━━━━● immer
    1     2   ø 3    ⌀ 4     5

ø = Median (3.2)
⌀ = Durchschnitt (3.8)
```

**Elemente:**
- Horizontale Linie (1-5 Skala)
- Labels: nie, selten, manchmal, oft, immer
- Zwei Marker:
  - **Median** (rot, ø)
  - **Durchschnitt** (dunkelrot, ⌀)
- Frage oberhalb (kompakt)

**Mobile:**
- Volle Breite
- Touch-freundlich
- Gut lesbare Labels

### Teil B/C - Horizontale Balkendiagramme

**Design:**
```
Frage: Bevorzugte Sockenlänge

Knöchellänge     ████████████████ 45%
Mittlere Länge   ████████████ 32%
Knielang         ██████ 15%
No-Show          ███ 8%
```

**Features:**
- Horizontale Balken (links → rechts)
- Prozent-Label am Ende
- Sortiert nach Häufigkeit (höchste zuerst)
- Rote Balken (--color-red-primary)
- Frage als Titel oberhalb

**Technisch:**
- Chart.js Horizontal Bar Chart
- Responsive
- Animierte Balken beim Einscrollen

### Teil D - Zeichnungs-Slideshow

**Implementierung:**
- **Library:** Swiper.js
- **Features:**
  - Touch-Swipe (Mobile)
  - Pfeiltasten + Buttons (Desktop)
  - Pagination: "3 / 24"
  - Loop-Modus
- **Design:**
  - Zeichnung zentriert
  - Schwarzer Hintergrund
  - Minimale UI (nur Pfeile + Counter)

**Performance:**
- Lazy-Loading für Bilder
- Preload: Aktuelles ± 2 Bilder
- WebP Format wenn möglich

### Offene Fragen - Scrollbare Listen

**Design:**
```
┌─────────────────────────────────────┐
│ "Liebe Socke, du warst immer für    │
│  mich da. Ohne dich ist der         │
│  Wäschekorb leer."                  │
│                     - Teilnehmer 3  │
├─────────────────────────────────────┤
│ "Ich vermisse dich jeden Tag."      │
│                     - Teilnehmer 7  │
└─────────────────────────────────────┘
```

**Features:**
- Card-Design
- Leichter Schatten (--shadow-sm)
- Scrollbar bei vielen Einträgen
- Teilnehmer-ID oder anonym

---

## 6. Responsive Design (Mobile-First)

### Breakpoints

```css
/* Mobile: 0-767px (Base) */
:root {
  --padding: 16px;
  --font-size-h1: 32px;
  --font-size-h2: 24px;
  --font-size-body: 16px;
}

/* Tablet: 768px-1023px */
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
  /* Max-Width für Content: 1200px */
}
```

### Mobile-Optimierungen

- **Touch-Targets:** Min. 44x44px (Apple Guidelines)
- **Schriftgrößen:** Min. 16px (verhindert Auto-Zoom auf iOS)
- **Charts:** Vertikal gestapelt, 100% Breite
- **Navigation:** Kompakt (Burger-Menu oder Horizontal-Scroll)
- **Hero:** Socke zentriert, responsive Scaling

### Desktop-Optimierungen

- Größere Charts mit mehr Spacing
- Navigation als fixierte Leiste
- Content max-width: 1200px (zentriert)
- Hover-States für Interaktionen

---

## 7. Design-System

### Farben

```css
:root {
  /* Basis */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-gray-100: #F5F5F7;    /* Sehr helles Grau */
  --color-gray-200: #E8E8ED;    /* Helles Grau */
  --color-gray-800: #1D1D1F;    /* Fast Schwarz */

  /* Akzente (von Socke) */
  --color-red-primary: #D32F2F;  /* Socken-Rot */
  --color-red-dark: #B71C1C;     /* Dunkler für Hover */

  /* Schatten (Apple-Style) */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.12);
}
```

**Verwendung:**
- **Hintergrund:** Weiß/Grau-100 (Sections), Schwarz (Hero)
- **Text:** Grau-800 (primary), Grau-600 (secondary)
- **Akzente:** Rot (Charts, Buttons, Links)
- **Schatten:** Sparsam für Cards/Elevated Elements

### Typografie

**Font-Stack:**
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

**Gewichte:**
- 400 (Regular) - Body-Text
- 600 (Semibold) - Sub-Headlines
- 700 (Bold) - Headlines

**Line-Heights:**
- 1.2 - Headlines
- 1.5 - Body-Text
- 1.4 - Navigation

### Spacing-System

```css
--space-xs: 8px;
--space-sm: 16px;
--space-md: 24px;
--space-lg: 48px;
--space-xl: 64px;
```

---

## 8. Performance & Deployment

### Performance-Ziele

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** > 90
- **Bundle Size:** < 100KB JS (gzipped)

### Optimierungen

**Code:**
- Code-Splitting: Swiper.js lazy-loaded
- Tree-Shaking via Vite
- Minification (JS & CSS)

**Assets:**
- Bilder: WebP Format + Kompression
- Lazy-Loading für Zeichnungen
- Responsive Images (srcset)

**Caching:**
- Service Worker (optional)
- Lange Cache-Zeiten für statische Assets

### Deployment

**Build-Prozess:**
```bash
npm run build  # → dist/ Ordner
```

**Hosting-Optionen:**
- Netlify (empfohlen - Auto-Deploy)
- Vercel
- GitHub Pages
- Cloudflare Pages

**Domain:**
- Wird später vom Nutzer konfiguriert

---

## 9. Zusammenfassung

### Was wird gebaut

Eine statische, mobile-optimierte Website die:
- Fragebogen-Ergebnisse visualisiert (Diagramme, Skalen, Listen)
- Apple-ähnliches Design hat (clean, minimal, elegant)
- Mit Scroll-Animationen begeistert (Hero-Reveal)
- Teilnehmer-Zeichnungen präsentiert (Swipe-Slideshow)

### Technologie

- **Vanilla JavaScript** (kein Framework - wie Apple)
- **Chart.js** für Visualisierungen
- **Vite** für modernes Tooling
- **Mobile-First** CSS

### Nächste Schritte

1. ✅ Design validiert
2. → Implementierungsplan erstellen
3. → Website entwickeln
4. → Testing & Deployment
