# Website-Struktur

Eine Hauptdomain, darunter die Objekte, darunter die einzelnen Wohnungen. Weitere Objekte
lassen sich ohne Strukturänderung ergänzen.

```
hauptdomain.de/
├─ rosenhof-zur-weser/          Objektseite Weserbergland
│  ├─ fachwerktraum/
│  ├─ blick-ins-gruene/
│  └─ das-quartier/
├─ haus-am-beckerberg/          Objektseite Harz
│  ├─ einhorn/
│  ├─ kobold/
│  └─ drachen/
├─ direkt-buchen/               Direktbuchungsvorteil (10 %)
├─ firmenunterkunft/            Zielgruppenseite für Das Quartier
├─ region/                      Ausflugsziele, regionale Inhalte
├─ kontakt/
├─ impressum/  datenschutz/  agb/
```

`node scripts/sitemap.mjs` gibt diese Liste jederzeit aus dem aktuellen Datenstand aus.

## Warum Pfade und keine Subdomains

„Darunter“ lässt sich auf zwei Arten bauen:

| | Pfade (`hauptdomain.de/rosenhof-zur-weser/`) | Subdomains (`rosenhof.hauptdomain.de`) |
| --- | --- | --- |
| Suchmaschinen | Eine Domain sammelt die gesamte Autorität | Jede Subdomain baut ihre Autorität separat auf |
| Aufwand | Ein Host, ein Zertifikat, ein Deployment | Pro Objekt DNS, Zertifikat, Deployment |
| Neues Objekt | Ein Eintrag in `content/objekte.json` | Zusätzlich DNS und Hosting einrichten |

Das erklärte Ziel ist ein möglichst gutes organisches Ranking ohne Werbebudget. Genau
dafür sind Pfade die bessere Wahl: alles, was ein Objekt an Sichtbarkeit gewinnt, zahlt
auf dieselbe Domain ein. Bei sechs Einheiten an zwei Standorten gibt es keinen Grund, die
Autorität aufzuteilen.

Hinterlegt ist die Entscheidung in `content/site.json` unter `domain.struktur`.

## Bestehende Domain

`rosenhof-zur-weser.de` ist vorhanden und behält Rankings und Verlinkungen. Sie wird per
**301** dauerhaft auf `/rosenhof-zur-weser/` weitergeleitet — nicht abschalten, sonst geht
die aufgebaute Sichtbarkeit verloren. Für Haus am Beckerberg ist keine Domain bekannt;
eine eigene wird bei dieser Struktur auch nicht gebraucht.

## Der Name ist die einzige offene Variable

Marke und Domain stehen ausschließlich in `content/site.json`:

```json
"marke":  { "status": "offen", "name": "PLATZHALTER_MARKE" },
"domain": { "status": "offen", "haupt": "PLATZHALTER_DOMAIN" }
```

Alles andere — Seitenstruktur, Pfade, Weiterleitungen, Titel — ist davon unabhängig und
bereits festgelegt. Sobald die Entscheidung fällt, werden diese Felder gesetzt und
`status` auf `"entschieden"` geändert; der Rest bleibt unberührt.

Die Platzhalter sind bewusst als solche lesbar, damit eine versehentlich veröffentlichte
URL sofort auffällt.

## Ein weiteres Objekt aufnehmen

1. In `content/objekte.json` unter `objekte` einen Eintrag mit `id`, `name`, `region`,
   `adresse` und `einheiten` ergänzen.
2. Falls der URL-Slug vom `id` abweichen soll, `slug` setzen (so machen es die drei
   Harz-Wohnungen: `id: "fewo-einhorn"`, `slug: "einhorn"`).
3. `node scripts/sitemap.mjs` prüfen — Objekt- und Einheitenseiten erscheinen automatisch.

Für die geplanten Tiny Houses in Höxter-Stahle ist damit alles vorbereitet; es fehlen nur
Namen und Daten.

## Verbindung zu Smoobu

Jede Einheit trägt `smoobuApartmentId`. Darüber holt die Website Verfügbarkeiten und
aktuelle Preise, während Texte und Stammdaten aus `content/objekte.json` kommen. Solange
die IDs auf `null` stehen, markiert `scripts/sitemap.mjs` die betroffenen Seiten und
`scripts/smoobu-check.mjs` zeigt nach erfolgreicher Verbindung, welche Smoobu-Apartments
zur Auswahl stehen.

## Noch offen

- Marke und Domain (blockiert Domainkauf, Logo, Impressum, alle Texte)
- Smoobu-Apartment-IDs je Einheit
- Inhalte für Impressum, Datenschutz, AGB
- Ausstattungsdaten und Fotos für fünf der sechs Einheiten (siehe
  `docs/wissensbasis/AUSWERTUNG.md`)
