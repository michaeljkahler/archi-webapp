# Iteration 3: Glossar, UI, Mobile

**Datum:** 2026-03-11
**Status:** Abgeschlossen

---

## 1. DMA-Glossar Status

Das DMAGlossary ist bereits gut implementiert:
- Card-Layout mit Accordion-Expand
- Suchfeld mit Text-Filter ueber Name, Beschreibung und diagnostischen Wert
- Kategorie-Filter (5 Kategorien: Houppier, Branches, Tronc, Fleche, Arbre entier)
- DMA-Bilder aus dma.json korrekt eingebunden (mit `onError` Fallback)
- Beschreibung und diagnostischer Wert in aktueller Sprache

### Fix: Null-Seitenzahl bei artspezifischen Markern
- **Problem:** 6 neue artspezifische DMA-Marker (Iteration 2) haben `guide_page: null`, wurde als "Handbuchseite null" angezeigt
- **Fix:** `DMAGlossary.jsx` — Guide-Page wird nur angezeigt, wenn vorhanden (`{marker.guide_page && ...}`)

## 2. DiagnosisView — DMA-Hilfe Bugfixes

### Fix: Hardcoded Fallback-Bild entfernt
- **Problem:** DMA-Hilfe-Overlay zeigte `guide_p24_0.png` als Fallback fuer ALLE Marker ohne Bild
- **Fix:** `DiagnosisView.jsx` Zeile 313-318 — Bild wird nur gerendert, wenn `illustration_extracted` vorhanden ist. Kein falsches Bild mehr.

### Fix: DMA-Hilfe zeigt uebersetzte Namen
- **Problem:** DMA-Hilfe-Buttons zeigten raw IDs (`module_sommital`) statt uebersetzte Namen
- **Fix:** DMA-Name wird aus `dma.json` geladen und in aktueller Sprache angezeigt (`dma?.name?.[language]`)
- Touch-Target auf `min-h-touch` (48px) gesetzt

## 3. Mobile-Optimierung

### Bereits vorhanden (vor Iteration 3):
- `min-h-touch` (48px) auf allen interaktiven Elementen (Buttons, Links)
- Responsive Grid-Layouts (`grid-cols-1 md:grid-cols-2/3`)
- Mobile Hamburger-Menue im Header mit `md:hidden`
- Sprachumschalter mit `min-h-touch min-w-touch`
- Flex-Wrap fuer Button-Gruppen
- `species-tile` mit `min-h-[120px]` fuer ausreichende Touch-Flaeche

### Fix: SiteSummary Header Layout
- **Problem:** Header mit `flex justify-between` liess Titel und Buttons auf 360px ueberlappen
- **Fix:** Stacked Layout — Titel/Standort oben, Buttons darunter (`mt-4`)
- Responsive Textgroesse: `text-2xl sm:text-3xl`

## 4. Farbcodierung der ARCHI-Typen

Bereits in Tailwind-Config definiert und durchgaengig verwendet:

| Zustand | Farbe | Hex | Verwendet in |
|---------|-------|-----|-------------|
| Sain | Gruen | #4CAF50 | Results, SiteSummary Badges |
| Stresse | Gelb/Orange | #FFC107–#FF8F00 | Results (Abstufungen 1-5) |
| Resilient | Blau | #2196F3 | Results |
| Descente | Orange | #FF9800 | Results |
| Repli | Lila | #9C27B0 | Results |
| Irreversible | Rot | #F44336–#D32F2F | Results |
| Mort | Schwarz | #1a1a1a | Results |
| Senescent | Grau | #9E9E9E | Results |

Farbcodierung wird angezeigt in:
- DiagnosisView: Result-Badge (`result-badge` CSS-Klasse)
- SiteSummary: Tree-Cards (farbcodierter ARCHI-Code Badge)
- DiagnosisView: State-Badge neben dem Ergebnis

## 5. CycleDiagram-Komponente

- **Status:** Vorhanden in `src/components/CycleDiagram.jsx`
- Verwendet in `AboutPage.jsx`
- Zeigt 7 Zyklusbilder aus `public/images/cycle/`
- Collapsible mit Accordion-Toggle
- `highlightState` Prop vorhanden (fuer kuenftige Hervorhebung der aktuellen Diagnose-Position)

## 6. Bestandesliste (SiteSummary)

Bereits korrekt implementiert seit Iteration 1:
- ARCHI-Typen mit Farb-Badge (Hintergrundfarbe + weisser Code-Text)
- Zustand als Text daneben (uebersetzt via `t('states.xxx')`)
- "Diagnose starten →" fuer Baeume ohne Diagnose
- "Neu diagnostizieren" fuer Baeume mit Diagnose

## 7. Verifikation

- 131/131 Tests bestanden
- Build erfolgreich
- Alle DMA-Hilfe-Buttons zeigen uebersetzte Namen
- Kein Fallback-Bild mehr bei Markern ohne Illustration
- SiteSummary-Header umbricht sauber auf 360px
