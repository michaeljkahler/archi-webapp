# Iteration 4: Offline, Uebersetzung, Qualitaet

**Datum:** 2026-03-11
**Status:** Abgeschlossen

---

## 1. Netzunabhaengigkeit

### Build-Analyse

| Pruefpunkt | Status | Details |
|-----------|--------|---------|
| Kein CDN-Import im HTML | OK | Keine externen Script/Link-Tags |
| Fonts lokal | OK | System-Fonts: `ui-sans-serif, system-ui, sans-serif` |
| Tailwind als Build-Output | OK | Kompiliert in `style-BGl1naEj.css` (kein CDN) |
| Keine fetch()-Calls extern | OK | Kein `fetch()` zu externen APIs |
| Service Worker | OK | `sw.js` + Workbox generiert, 118 precache entries |
| manifest.webmanifest | OK | name, display:standalone, icons |
| Alle Bilder lokal | OK | 101 Bilder in `public/images/` |
| IndexedDB | OK | Dexie.js fuer Sites + Trees |
| GPS offline | OK | Browser Geolocation API (geraetebasiert) |
| PWA-Icons | OK | icon-192.png, icon-512.png |
| crossorigin entfernt | OK | Custom Vite Plugin fuer file:// Kompatibilitaet |

### SW-Registrierung

```javascript
// Sicher: Nur bei HTTP(S), nicht bei file://
if (location.protocol.startsWith('http') && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', { scope: './' })
}
```

### Build-Groesse

| Asset | Groesse | gzip |
|-------|---------|------|
| index.js | 750 KB | 244 KB |
| html2canvas.js | 201 KB | 48 KB |
| style.css | ~20 KB | ~5 KB |
| Total precache | 1183 KB | — |

## 2. Uebersetzungspruefung

### Key-Vollstaendigkeit

- **198 Keys** in beiden Sprachen (DE + FR)
- Keine fehlenden Keys in DE
- Keine fehlenden Keys in FR

### Fachbegriffe verifiziert

| FR (Original) | DE (in App) | Status |
|---------------|-------------|--------|
| Sain | Gesund | OK |
| Stresse | Gestresst | OK |
| Resilient | Resilient | OK |
| Descente de cime | Kronenrueckzug | OK |
| Repli | Repli | OK |
| Deperissement irreversible | Irreversibler Verfall | OK |
| Mort | Tot | OK |
| Senescent | Seneszent | OK |
| Colonie | Kolonie | OK |

### Hardcoded-Strings-Pruefung

- Keine hardcodierten deutschen oder franzoesischen Strings in JSX-Komponenten gefunden
- Alle User-facing Texte laufen ueber `t()` / useLanguage Hook
- Footer-Zitat korrekt auf Franzoesisch (Originalsprache der Methode)

## 3. Build-Test

```
npm run build: OK
- Vite Build: 1.94s
- PWA precache: 118 entries (1183 KB)
- sw.js + workbox generiert
- Keine Build-Fehler
- Warnung: index.js >500KB (html2canvas Bibliothek)
```

## 4. Tests

```
131/131 Tests bestanden
- 6 i18n Tests
- 125 treeEngine Tests (alle 8 Baumarten)
```

## 5. Verifikation

- Keine externen URLs im Build (ausser Lizenz-Kommentare in html2canvas)
- Alle i18n-Keys in DE und FR vorhanden
- Fachbegriffe stimmen mit CNPF-Terminologie ueberein
- Build fehlerfrei
- PWA vollstaendig konfiguriert
- Offline-faehig: Service Worker cacht alle Assets
