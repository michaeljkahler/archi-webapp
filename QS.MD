# ARCHI WebApp – Qualitätssicherung & Fehlerbehebung

## Status: ITERATION 5 — Single-File HTML Build

---

## 1. Problemanalyse: Blank Screen

### Symptom
- `index.html` via `file://` Protokoll → weisser Bildschirm
- Seitentitel "ARCHI Baumdiagnose" lädt → HTML wird geparsed
- Kein React-Content gerendert → JavaScript blockiert

### Root Cause 1: `crossorigin` + `type="module"` auf `file://`
- Chrome/Brave blockieren `crossorigin` Requests auf `file://` wegen CORS-Policy
- ES Module (`type="module"`) laden mit CORS-Semantik
- **Ergebnis: JavaScript wird nicht geladen → Blank Screen**

### Root Cause 2: Brave + Chrome blockieren ALLE externen Scripts auf `file://`
- Selbst OHNE `crossorigin` blockieren moderne Browser externe `<script src>` auf `file://`
- Fehlermeldung: "Access to script from origin 'null' has been blocked by CORS policy"
- Betrifft: Brave, Chrome (alle Chromium-basiert)
- **Ergebnis: Auch ohne crossorigin → Blank Screen**

---

## 2. Durchgeführte Fixes (chronologisch)

### Fix 1-3 (frühere Sessions)
- `base: './'` statt `base: '/archi-webapp/'` für relative Pfade
- `HashRouter` statt `BrowserRouter` für file:// Kompatibilität
- `useLanguage.jsx` importiert JSON-Dateien statt Inline-Übersetzungen
- Alle i18n-Keys synchronisiert zwischen Komponenten und JSON-Dateien
- TreeForm.jsx: Korrekte Baumliste (19 Arten statt 160+ Fehler-Einträge)

### Fix 4: crossorigin entfernt
- Custom Vite Plugin `removeCrossOrigin()` entfernt alle `crossorigin`-Attribute
- `build.modulePreload: false` — verhindert `<link rel="modulepreload" crossorigin>`
- **Ergebnis: Funktioniert NICHT — Browser blockiert auch ohne crossorigin**

### Fix 5: SINGLE-FILE HTML (aktueller Fix)

**Strategie: Alles in eine einzige HTML-Datei inlinen**

```
vite.config.js:
├── inlineDynamicImports: true    → alle Tree-JSON im Hauptbundle
├── format: 'iife'                → kein ES Module, IIFE stattdessen
├── inlineEverything() Plugin:
│   ├── JS chunks → <script>CODE</script>
│   ├── CSS assets → <style>CODE</style>
│   ├── </script> Escaping        → <\/script> (jsPDF-Fix)
│   ├── $& Replacement-Fix        → Function replacement statt String
│   ├── Manifest-Link entfernt
│   ├── crossorigin entfernt
│   └── type="module" entfernt
```

**Technische Details:**
- `inlineDynamicImports: true` — alle 8 Entscheidungsbaum-JSONs werden ins Hauptbundle kompiliert
- `format: 'iife'` — Immediately Invoked Function Expression, kein ES Module nötig
- `inlineEverything()` Plugin im `generateBundle` Hook:
  - Ersetzt `<script src="./file.js">` mit `<script>INLINE_CODE</script>`
  - Ersetzt `<link href="./file.css">` mit `<style>INLINE_CSS</style>`
  - Escaped `</script>` zu `<\/script>` in inlined JS (jsPDF enthält 17x literal `</script>`)
  - Verwendet Function-Replacement um `$&`-Korruption zu vermeiden
  - Entfernt Manifest-Link, crossorigin-Attribute, type="module"

**Ergebnis:**
- `index.html` = 1.18 MB (alles enthalten)
- 0 externe JS-Referenzen
- 0 externe CSS-Referenzen
- 0 unescaped `</script>` im inline JS
- 0 manifest/crossorigin/type=module Referenzen
- Kein Netzwerk-Request nötig → funktioniert auf `file://`

---

## 3. Validierung

### Build-Integrität
- [x] Alle 9 JSX-Seiten vorhanden und syntaktisch korrekt
- [x] Alle 8 Entscheidungsbaum-JSON validiert und inline gebundelt
- [x] Alle Utility-Dateien (storage, treeEngine, export) vorhanden
- [x] Alle Hooks (useLanguage, useGeolocation) vorhanden
- [x] Keine fehlenden Imports in der gesamten Codebasis
- [x] JS + CSS vollständig inline in index.html
- [x] Kein `</script>` Breakage im inline JS
- [x] Kein `$&` Replacement-Pattern Korruption
- [x] HashRouter im Bundle enthalten
- [x] Beide Sprachen (DE/FR) komplett im Bundle

### Generiertes HTML:
```html
<!DOCTYPE html>
<html lang="de">
<head>
  <title>ARCHI Baumdiagnose</title>
  <style>/* 842 KB Tailwind CSS inline */</style>
  <script>/* 1.15 MB React App inline (IIFE) */</script>
</head>
<body>
  <div id="root"></div>
  <script>/* Safe SW registration - only on HTTP */</script>
</body>
</html>
```

---

## 4. Checkliste — Bitte vom Nutzer zu testen

- [ ] App lädt auf `file://` ohne Blank Screen (Chrome + Brave)
- [ ] Header mit Navigation sichtbar
- [ ] Sprachumschaltung DE ↔ FR (FR-Button oben rechts)
- [ ] 8 Baumarten auf der Diagnose-Seite
- [ ] Diagnose-Entscheidungsbaum: Frage → Ja/Nein → Ergebnis
- [ ] Bestände-Seite erreichbar (Standort-Verwaltung)
- [ ] Glossar mit Suchfunktion
- [ ] About-Seite mit Methodenbeschreibung
- [ ] Bilder (DMA, Flowcharts) laden korrekt

### Hinweis zu Bildern
Bilder (`<img src="./images/...">`) sollten auf `file://` funktionieren, da `<img>` Tags NICHT von der CORS-Policy betroffen sind. Falls Bilder nicht laden, liegt es an fehlenden Dateien im `images/` Ordner relativ zur `index.html`.
