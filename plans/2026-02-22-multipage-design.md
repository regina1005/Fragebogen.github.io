# Sockendynamik-Website — Mehrseiten-Design

**Datum:** 2026-02-22
**Branch:** `feature/multipage-design`
**Basis:** Scrollbare Version auf `master`

---

## Ziel

Umbau der scrollbaren Single-Page-App zu einer 6-Seiten-App mit Slide-Übergängen. Die Besitzerin möchte eine App-ähnliche Erfahrung: eine Seite pro Themenbereich, mit Wisch-/Button-Navigation.

---

## Architektur

**Single HTML + JavaScript Router**

Eine `index.html` mit 6 Panels (`<div class="page" id="...">`). Immer nur ein Panel sichtbar. Slide-Animation via CSS `transform: translateX`. CSV wird einmal beim Seitenstart geladen, alle Panels werden sofort gerendert — kein Nachladen beim Seitenwechsel.

Der komplette Visualisierungs-Code (Likert, Balken, Abschiebsbriefe, Swiper-Slideshow, CSV-Parser) wird unverändert wiederverwendet.

### Dateistruktur (Änderungen)

```
src/
├── main.js                  ← PageRouter hinzufügen, Scroll-Init entfernen
├── router.js                ← NEU: PageRouter-Klasse
├── styles/
│   ├── main.css             ← hero.css-Import entfernen
│   ├── pages.css            ← NEU: Panel-Layout, Slide-Animation, Bottom-Bar
│   └── navigation.css       ← ENTFERNT (sticky nav nicht mehr nötig)
```

`hero.css`, `scroll.js` und die sticky Navigation werden nicht mehr benötigt.

---

## 6 Seiten

| ID | Inhalt | Sektion |
|----|--------|---------|
| `#start` | Sockenbild + Titel + „Tippen zum Starten" | — |
| `#teil-a` | Likert-Skalen: Emotionale Bindung (7 Fragen) | A |
| `#teil-b` | Balkendiagramme: Entscheidungspräferenzen (9 Fragen) | B |
| `#teil-c` | Balkendiagramme: Sockenpräferenzen (7 Fragen) | C |
| `#teil-d` | Abschiebsbriefe: Textkarten | D |
| `#teil-e` | Zeichnungen: Swiper-Slideshow | E |

---

## Startseite (`#start`)

- Schwarzer Hintergrund, vollbild
- Sockenbild zentriert (max 70% Breite)
- Titel: „Sockendynamik- und Paarbindungsinventar" (weiß)
- Subtitle: „↓ Tippen zum Starten" (grau, klein)
- Zentraler Button: „Starten →"
- Tippen auf das Bild navigiert ebenfalls zu Seite A
- Kein Dot-Indikator auf der Startseite

---

## Ergebnisseiten (A–E)

- Fixer Header oben: Sektionsbuchstabe (groß, dekorativ) + Titel + Subtitle
- Inhalt scrollbar (`overflow-y: auto`) zwischen Header und Bottom-Bar
- Bottom-Bar fixiert am unteren Rand
- Ausreichend `padding-bottom` damit der letzte Inhalt nicht von der Bar verdeckt wird

---

## Bottom-Bar

```
[ ← Zurück ]   ●●○○○○   [ Weiter → ]
```

- Schwarzer Hintergrund, `backdrop-filter: blur` bei Scroll
- Dots: 6 Punkte (ab Seite A sichtbar), aktuelle Seite: `--color-red-primary` ausgefüllt
- Erste Seite (A): Zurück-Button vorhanden (→ zurück zur Startseite)
- Letzte Seite (E): Kein Weiter-Button
- Startseite: Kein Dot-Indikator, nur zentraler „Starten"-Button

---

## Slide-Animation

```css
/* Seite kommt von rechts rein (Vorwärts) */
.page-enter-forward  { transform: translateX(100%); }
.page-exit-forward   { transform: translateX(-100%); }

/* Seite kommt von links rein (Rückwärts) */
.page-enter-backward { transform: translateX(-100%); }
.page-exit-backward  { transform: translateX(100%); }
```

- Dauer: 300ms `cubic-bezier(0.4, 0, 0.2, 1)`
- Beide Panels (ein- und ausgehend) animieren gleichzeitig
- Während Animation: Buttons deaktiviert (verhindert Doppelklick)

---

## JavaScript: PageRouter

```javascript
class PageRouter {
  constructor(pages) { /* pages = ['start', 'teil-a', ...] */ }
  navigateTo(index, direction)  // 'forward' | 'backward'
  next()
  back()
  updateDots()
  updateButtons()
}
```

- Verwaltet `currentIndex`
- Rendert Dots dynamisch (Start: keine, A–E: 6 Dots)
- Aktiviert/deaktiviert Weiter/Zurück-Buttons je nach Position

---

## Daten-Ladestrategie

1. Seite lädt → alle Panels im DOM, aber unsichtbar
2. Startseite zeigt sich sofort (kein Netzwerk-Wait)
3. CSV wird asynchron geladen
4. Solange CSV lädt: Ergebnisseiten zeigen Lade-Indikator
5. Nach erfolgreichem Laden: Visualisierungen rendern sich in alle Panels
6. Navigation zu Ergebnisseiten erst möglich wenn Daten geladen (oder: sofort navigierbar, Indikator zeigt noch „Lade...")

---

## Responsive Design

- Mobile-First (375px+)
- Bottom-Bar: min 60px Höhe, Touch-Targets min 44px
- Dots: 10px Durchmesser, 8px Abstand
- Auf Desktop (1024px+): max-width 600px, zentriert (App-Look)

---

## Was entfällt

- Scroll-basierte Hero-Animation (`scroll.js`, `hero.css`)
- Sticky Navigation (`navigation.css`, `initNavigation`, `initActiveNavTracking`)
- `200vh` Hero-Höhe

## Was bleibt

- Alle Visualisierungsmodule unverändert
- CSS-Design-System (variables, reset, visualizations, slideshow)
- CSV-Parser
- Performance-Optimierungen in `vite.config.js`
- `docs/`-Build für GitHub Pages
