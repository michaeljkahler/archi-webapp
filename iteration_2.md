# Iteration 2: Daten & Bilder

**Datum:** 2026-03-11
**Status:** Abgeschlossen

---

## 1. Platzhalter-Bilder entfernt

21 Platzhalter-Dateien (je 264 Bytes) wurden identifiziert und entfernt:

| Verzeichnis | Anzahl | Dateien |
|------------|--------|---------|
| `public/images/dma/` | 20 | guide_p13_0, p14_0, p15_2, p16_0, p17_0, p18_0, p19_1, p20_6, p21_6, p22_0, p24_3, p25_3, p26_2, p27_2, p28_3, p29_2, p30_1, p31_2, p32_0, p33_0 |
| `public/images/silhouettes/` | 1 | silhouette_p12_2 |

**Ergebnis:** 101 echte Bilder verbleiben (alle >1KB).

## 2. DMA-Bildreferenzen korrigiert (dma.json)

8 Referenzen in `dma.json` wurden auf korrekte, existierende Bilddateien umgestellt:

| DMA-ID | Alt (fehlte/Platzhalter) | Neu (existiert) |
|--------|-------------------------|-----------------|
| fourches_maitresses | guide_p13_0.png | guide_p13_2.png |
| branches_verticales | guide_p14_0.png | guide_p14_2.png |
| ramification_appauvrie | guide_p16_0.png | guide_p16_2.png |
| arcures | guide_p17_0.png | guide_p17_2.png |
| mortalite_anormale | guide_p18_0.png | guide_p18_2.png |
| coloration_anormale | guide_p22_0.png | guide_p22_2.png |
| microphyllie | guide_p23_0.png | guide_p23_1.png |
| fleche | guide_p29_0.png | guide_p29_1.png |

**Zuvor fehlendes Bild extrahiert:** `guide_p12_0.png` (contour_houppier, 139KB) aus Guide_archi_bdef.pdf Seite 11.

## 3. DMA-Bildstatus nach Korrektur

Alle 20 Original-DMA-Marker referenzieren nun echte Bilder:

| DMA-ID | Bild | Groesse |
|--------|------|---------|
| contour_houppier | guide_p12_0.png | 139 KB |
| fourches_maitresses | guide_p13_2.png | 124 KB |
| branches_verticales | guide_p14_2.png | 151 KB |
| ramification_normale | guide_p15_0.png | 115 KB |
| ramification_appauvrie | guide_p16_2.png | 155 KB |
| arcures | guide_p17_2.png | 173 KB |
| mortalite_anormale | guide_p18_2.png | 142 KB |
| chicots | guide_p19_0.png | 183 KB |
| echancrures | guide_p20_0.png | 99 KB |
| deficit_foliaire | guide_p21_0.png | 14 KB |
| coloration_anormale | guide_p22_2.png | 179 KB |
| microphyllie | guide_p23_1.png | 145 KB |
| suppleants_orthotropes | guide_p24_0.png | 111 KB |
| suppleants_plagiotropes | guide_p25_0.png | 124 KB |
| suppleants_ageotropes | guide_p26_0.png | 123 KB |
| deuxieme_houppier | guide_p27_0.png | 131 KB |
| racines_internes | guide_p28_0.png | 136 KB |
| fleche | guide_p29_1.png | 144 KB |
| axes_dedifferencies | guide_p30_0.png | 131 KB |
| module_types | guide_p31_0.png | 125 KB |

## 4. Entscheidungsbaum-Validierung

### Ergebnisse

| Baumart | Nodes | Results | Erreichbar | Status |
|---------|-------|---------|------------|--------|
| chenes_hetre | 13 | 12 | 12 | OK |
| chataignier | 23 | 21 | 21 | OK |
| platane | 25 | 19 | 19 | OK |
| douglas | 12 | 11 | 11 | OK |
| epicea | 15 | 13 | 13 | OK |
| sapin_pectine | 15 | 10 | 10 | OK |
| cedre | 26 | 16 | 15 | 1 unerreichbar |
| pins | 18 | 15 | 14 | 1 unerreichbar |

### Unerreichbare Ergebnisse (benoetigen PDF-Verifikation)

- **cedre.json**: Result `Sn` (Seneszent) definiert, aber kein Pfad fuehrt dorthin. Benoetigt Abgleich mit der Cedre-PDF, um festzustellen, wo die Seneszenz-Diagnose angebunden werden soll.
- **pins.json**: Result `JS5` (Jung Gestresst 5) definiert, aber kein Pfad fuehrt dorthin. Benoetigt Abgleich mit der Pins-PDF.

**Keine Runtime-Auswirkung** — diese Results sind nur definiert, werden aber nie erreicht.

### Validierungspruefungen bestanden

Fuer alle 8 Baeume:
- Alle Pfade enden in einem definierten Result (keine Sackgassen)
- Alle yes/no/skip-Referenzen zeigen auf existierende Nodes oder Results
- Alle Fragen sind in DE und FR vorhanden
- Alle dma_refs existieren in dma.json

## 5. Fehlende DMA-Referenzen behoben

6 artspezifische DMA-Marker fehlten in `dma.json` und wurden ergaenzt:

| DMA-ID | Referenziert von | Beschreibung |
|--------|-----------------|-------------|
| module_sommital | cedre (6x), chataignier (1x) | Gipfelmodul des Stammes, Typ 1-4 |
| feuillage | douglas (1x), sapin_pectine (2x) | Belaubung/Benadelung |
| rameaux | epicea (2x) | Zweige auf ganzer Astlaenge |
| plateau | pins (1x) | Plateaukrone bei alten Kiefern |
| forme_architecturee | platane (2x) | Geschnittene/architekturierte Baumform |
| forme_etete | platane (1x) | Gestutzte Baumform |

**dma.json total_markers:** 20 → 26 (6 artspezifische Marker ohne Illustration)

## 6. Flowchart-Bilder

Alle 8 Baumarten haben korrekte `flowchart_images`-Referenzen:

| Baumart | Seiten | Dateien |
|---------|--------|---------|
| chenes_hetre | 1 | chenes_hetre.png |
| douglas | 1 | douglas.png |
| epicea | 1 | epicea.png |
| sapin_pectine | 1 | sapin_pectine.png |
| cedre | 2 | cedre_p1.png, cedre_p2.png |
| chataignier | 2 | chataignier_p1.png, chataignier_p2.png |
| pins | 2 | pins_p1.png, pins_p2.png |
| platane | 4 | platane_p1–p4.png |

Alle 14 Flowchart-Bilder existieren in `public/images/flowcharts/`.

## 7. Bild-Inventar

| Kategorie | Anzahl | Verzeichnis |
|-----------|--------|-------------|
| DMA-Illustrationen | 79 | public/images/dma/ |
| Flowcharts | 14 | public/images/flowcharts/ |
| Zyklusdiagramm | 7 | public/images/cycle/ |
| Silhouetten | 1 | public/images/silhouettes/ |
| **Total** | **101** | |

## 8. Verifikation

- 131/131 Tests bestanden
- Build erfolgreich (`npm run build`)
- Keine Platzhalter-Bilder mehr im Projekt
- Alle DMA-Referenzen in dma.json zeigen auf existierende Dateien
- Alle Flowchart-Referenzen in den Baum-JSONs zeigen auf existierende Dateien

## 9. Offene Punkte

- 2 unerreichbare Results (Sn in cedre, JS5 in pins) — PDF-Verifikation noetig
- 6 neue DMA-Marker ohne Illustration (artspezifische Marker, nicht im Pocket Guide)
- Beispielfotos aus Guide-Utilisation-PDFs koennten in spaeteren Iterationen extrahiert werden
