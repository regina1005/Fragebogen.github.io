# Sockendynamik- und Paarbindungsinventar — Ergebnisse

Satirische Studien-Visualisierungsseite für das "Sockendynamik- und Paarbindungsinventar" des Klinischen Instituts für Textile Objektbeziehungen (KITO).

## Features

- Interaktive Datenvisualisierungen (Likert-Skalen, Balkendiagramme)
- Apple-ähnliches, minimalistisches Design
- Mobile-First & vollständig responsive
- Scroll-basierte Animationen
- Swipe-fähige Bildergalerie für Zeichnungen
- Optimiert für Performance

## Tech Stack

- **Vite** — Build-Tool & Dev-Server
- **Vanilla JavaScript (ES6+)** — Kein Framework
- **Swiper.js** — Touch-Slideshow
- **PapaParse** — CSV-Parsing
- **CSS3** — Modern CSS mit Custom Properties

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
│   ├── utils/                # CSV-Parser, Scroll-Animation
│   └── visualizations/       # Visualisierungs-Module
├── docs/plans/               # Design & Implementation Docs
├── index.html
├── package.json
└── vite.config.js
```

## Entwicklung

```bash
npm install       # Dependencies installieren
npm run dev       # Dev-Server starten (http://localhost:3000)
npm run build     # Production Build
npm run preview   # Production Preview
```

## Daten einfügen

1. Fragebogen-Ergebnisse als `public/data.csv` speichern (Format: siehe unten)
2. Teilnehmer-Zeichnungen nach `public/drawings/` kopieren
3. Dateinamen der Zeichnungen in die CSV-Spalte `zeichnung_datei` eintragen
4. Build erstellen: `npm run build`

### CSV-Format

Erwartete Spalten:

| Spalte | Beschreibung |
|--------|-------------|
| `teilnehmer_id` | Eindeutige ID |
| `frage_a1` – `frage_a7` | Likert-Skala 1–5 |
| `frage_b1` – `frage_b9` | Binäre Wahl 0 oder 1 |
| `frage_c1` – `frage_c7` | Multiple Choice 0–5 |
| `abschiedsbrief` | Freitext |
| `zeichnung_datei` | Dateiname (z.B. `drawing_001.jpg`) |

## Deployment

Die Website ist eine statische Single-Page-App und kann überall gehostet werden:

- **Netlify**: `dist/` Ordner per Drag & Drop
- **Vercel**: GitHub-Integration
- **GitHub Pages**: `dist/` Ordner publishen

## Lizenz

Alle Faserrechte vorbehalten © 2026 KITO
