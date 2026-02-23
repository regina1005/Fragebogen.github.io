# Sockendynamik-Website

Satirische Studien-Visualisierungsseite für "Sockendynamik- und Paarbindungsinventar" (KITO).

## Status
Implementierung abgeschlossen. Warte auf echte Daten.

## Tech-Stack
- Vite + Vanilla JavaScript (kein Framework)
- Swiper.js für Zeichnungs-Slideshow
- PapaParse für CSV-Parsing

## Wichtige Befehle
- `npm run dev` — Dev-Server
- `npm run build` — Production Build

## Wichtige Dateien
- `plans/2026-02-22-socken-website-design.md` — Design-Dokument
- `plans/2026-02-22-socken-website-implementation.md` — Implementation Plan
- `public/data.csv` — Fragebogen-Ergebnisse (mit echten Daten ersetzen)
- `public/drawings/` — Teilnehmer-Zeichnungen
- `public/Socke_Bild.jpeg` — Hero-Image
- `docs/` — Build-Output für GitHub Pages (nicht manuell bearbeiten)

## Nächste Schritte
1. Echte CSV-Daten nach `public/data.csv` kopieren
2. Zeichnungen nach `public/drawings/` kopieren
3. `npm run build` ausführen → aktualisiert `docs/`
4. `docs/` Ordner auf GitHub hochladen → GitHub Pages aktivieren (Settings → Pages → /docs)
