# ARCHI Web-App

Interaktiver Bestimmungsschlüssel zur Vitalitätsdiagnose von Bäumen nach der Méthode ARCHI.

## Features

- **8 Baumarten**: Eichen/Buche, Kastanie, Platane, Douglasie, Fichte, Kiefern, Weisstanne, Atlaszeder
- **Zweisprachig**: Deutsch / Français (automatische Spracherkennung)
- **Interaktiver Entscheidungsbaum** mit DMA-Referenzbildern und Bestimmungsschlüssel-Overlay
- **DMA-Glossar**: 26 Dendromarker mit Illustrationen und diagnostischem Wert
- **Bestandesmonitoring**: Standorte + Einzelbäume mit GPS-Erfassung
- **Export**: CSV + PDF mit bilingualen Labels
- **PWA**: Offline-fähig für Feldarbeit (Service Worker + IndexedDB)
- **Mobile-first**: Grosse Touch-Targets, hoher Kontrast

## Tech Stack

- React 18 + Vite 5
- Tailwind CSS
- Dexie.js (IndexedDB)
- jsPDF + jsPDF-autotable
- vite-plugin-pwa (Workbox)
- Vitest + Testing Library

## Setup

```bash
cd archi-webapp
npm install
npm run dev
```

## Tests

```bash
npm test           # Einmalige Ausführung
npm run test:watch # Watch-Modus
```

131 Tests: Entscheidungsbaum-Pfade (alle 8 Arten), i18n-Vollständigkeit, TreeEngine API.

## Build & Deploy

```bash
npm run build
```

Deployment via GitHub Actions (`.github/workflows/deploy.yml`) auf GitHub Pages bei Push auf `main`.

## Projektstruktur

```
src/
  components/    Navbar, Footer, CycleDiagram
  data/
    trees/       8 Entscheidungsbaum-JSONs
    dma.json     26 Dendromarker (bilingual)
  hooks/         useLanguage, useGeolocation
  i18n/          de.json, fr.json
  pages/         HomePage, DiagnosisView, SiteSummary, etc.
  utils/         treeEngine, storage (Dexie), export
public/
  images/        Flowcharts, DMA-Illustrationen, Zyklus-Diagramme
  icons/         PWA-Icons
```

## Methode

Méthode ARCHI © CNPF — Drénou C., 2023
*Évaluer la vitalité des arbres. Guide d'utilisation de la méthode ARCHI.*
Éditions CNPF-IDF, Paris, 64 p.

Website: https://www.cnpf.fr/nos-actions-nos-outils/outils-et-techniques/archi

## Lizenz

Software: MIT License
Methode ARCHI: © CNPF / Christophe Drénou — Nutzung mit Genehmigung
