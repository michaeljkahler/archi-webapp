# Iteration 1: Bestandsaufnahme & Diagnose-Flow

**Datum:** 2026-03-11
**Status:** Abgeschlossen

---

## 1. Projektstruktur

```
archi-webapp/
├── public/images/          # ~120 Bilder (DMA, Flowcharts, Cycle, Silhouetten)
├── src/
│   ├── components/         # Header, Footer, CycleDiagram
│   ├── data/
│   │   ├── trees/          # 8 JSON-Entscheidungsbaeume
│   │   └── dma.json        # 20 Dendromarker mit DE/FR
│   ├── hooks/useLanguage.jsx  # i18n Provider (de.json + fr.json)
│   ├── i18n/               # de.json, fr.json
│   ├── pages/              # HomePage, SiteList, SiteForm, SiteSummary,
│   │                       # TreeForm, SpeciesSelector, DiagnosisView,
│   │                       # DMAGlossary, AboutPage
│   ├── utils/
│   │   ├── treeEngine.js   # Entscheidungsbaum-Engine
│   │   ├── storage.js      # Dexie/IndexedDB (sites + trees)
│   │   └── export.js       # CSV/PDF Export
│   └── __tests__/          # 131 Tests (Vitest)
├── _sources/               # 12 PDFs (Cles, Guide, Guides utilisation)
└── .github/workflows/      # deploy.yml (GitHub Pages)
```

## 2. Komponentenstatus vor der Iteration

| Komponente | Existiert | Rendert | i18n | Daten-Anbindung |
|-----------|-----------|---------|------|-----------------|
| DiagnosisView | Ja | Ja | Ja | NEIN - kein Save |
| TreeEngine | Ja | - | - | Funktioniert korrekt |
| TreeForm | Ja | Ja | Teilw. | NEIN - keine Diagnose-Verbindung |
| SiteSummary | Ja | Ja | Ja | Erwartet tree.diagnosis (nie befuellt) |
| SpeciesSelector | Ja | Ja | Teilw. | Standalone, kein Tree-Kontext |
| DMAGlossary | Ja | Ja | Ja | OK (dma.json) |
| CycleDiagram | Ja | Ja | Ja | OK |

## 3. Kritischer Bug: BUG-01 (BLOCKER)

### Problem
Die Diagnose war vollstaendig vom Baum-Workflow getrennt:
- **TreeForm** speicherte Baum, navigierte zurueck zum Bestand (kein Diagnose-Link)
- **DiagnosisView** fuehrte Diagnose durch, hatte aber **keinen Save-Button**
- **SpeciesSelector** war standalone unter `/diagnose` (kein site/tree Kontext)
- **SiteSummary** erwartete `tree.diagnosis` aber dieses Feld wurde nie beschrieben
- `updateTree()` in storage.js existierte, wurde aber nie aufgerufen

### Erwarteter User-Flow (laut debug_ARCHI.md)
```
Standort -> Neuer Baum -> Metadaten + Art -> Diagnose -> Ergebnis -> Speichern -> Bestandesliste
```

### Loesung

#### 3.1 TreeForm.jsx - Komplett ueberarbeitet
- **Vorher:** 19 freie Baumarten als Autocomplete-Textfeld, nach Speichern zurueck zum Bestand
- **Nachher:** 8 ARCHI-Arten als klickbare Kacheln (mit Icon, Name, Latein), nach Speichern direkt zur Diagnose
- Species-ID wird als ARCHI-Schluessel gespeichert (z.B. `chenes_hetre`, nicht Freitext)
- Navigation nach Save: `/sites/:siteId/trees/:treeId/diagnose/:species`
- Button-Text: "Speichern & Diagnose starten" / "Enregistrer & lancer le diagnostic"

#### 3.2 App.jsx - Neue Route
- Hinzugefuegt: `/sites/:siteId/trees/:treeId/diagnose/:species` -> DiagnosisView
- Bestehende Quick-Diagnose Route `/diagnose/:species` bleibt erhalten

#### 3.3 DiagnosisView.jsx - Save-Funktionalitaet
- Liest `siteId` und `treeId` aus URL-Params (Tree-linked Mode)
- **Neuer Save-Button** im Ergebnis-View (nur im Tree-linked Mode)
- Save ruft `updateTree(treeId, { diagnosis: {...}, decision_path: [...] })` auf
- Gespeicherte Daten:
  ```js
  {
    diagnosis: {
      code: 'ASa',           // ARCHI-Code
      label: { de: '...', fr: '...' },
      stage: 'adulte',
      state: 'sain',
      category: 'sain',      // Alias fuer SiteSummary-Kompatibilitaet
      color: '#4CAF50'
    },
    decision_path: [{ node, question, answer }, ...],
    diagnosis_date: '2026-03-11T...'
  }
  ```
- Nach Speichern: "Naechster Baum" und "Zurueck zum Bestand" Buttons
- Quick-Diagnose-Modus (ohne treeId) bleibt unveraendert

#### 3.4 SiteSummary.jsx - Diagnose-Anzeige verbessert
- Diagnose-Badge mit ARCHI-Code farbcodiert (z.B. gruener Badge "ASa")
- Zustand als Text daneben (z.B. "Gesund")
- Fuer Baeume OHNE Diagnose: Link "Diagnose starten ->"
- Fuer Baeume MIT Diagnose: Link "Neu diagnostizieren"

#### 3.5 SpeciesSelector.jsx - i18n Fix
- Hardcoded "8 Baumarten / 8 essences" durch `t('species.subtitle')` ersetzt

#### 3.6 i18n - Neue Keys (DE + FR)
- `species.subtitle`
- `trees.save_and_diagnose`
- `trees.start_diagnosis`
- `trees.rediagnose`
- `diagnosis.saved_success`
- `diagnosis.back_to_site`

## 4. Verifikation

- 131/131 Tests bestanden (i18n + treeEngine)
- Build erfolgreich (`npm run build`)
- Eichen/Buche-Schluessel: TreeEngine navigiert alle Pfade korrekt (DFS-Test besteht)

## 5. Was funktioniert nach Iteration 1

- Standort erstellen -> Baum hinzufuegen -> 8 ARCHI-Arten zur Auswahl
- Art auswaehlen -> automatisch zur Diagnose
- Diagnose durchfuehren (Ja/Nein/Skip-Fragen)
- Ergebnis mit ARCHI-Code, Farbe, Stadium, Zustand
- Ergebnis am Baum speichern (IndexedDB)
- "Naechster Baum" -> zurueck zum selben Bestand fuer naechsten Baum
- Bestandesliste zeigt ARCHI-Typen farbcodiert
- Nachdiagnose moeglich (Re-Diagnose Link)
- Quick-Diagnose weiterhin unter /diagnose verfuegbar

## 6. Offene Punkte (fuer spaetere Iterationen)

- 3 DMA-Bilder fehlen (guide_p12_0.png, guide_p23_0.png, guide_p29_0.png)
- 1 Platzhalter-Bild (silhouette_p12_2.png, 264 bytes)
- Glossar-Formatierung (Iteration 3)
- Mobile-Optimierung (Iteration 3)
- Uebersetzungsaudit (Iteration 4)
- Netzunabhaengigkeits-Pruefung (Iteration 4)
