# Wissensbasis Ferienwohnungen

Quelle: Repository-Export „ferienwohnungen_repository“, Stand 10.09.2026, ausgewertet
und in dieses Repository übernommen.

## Grundsatz (aus der Quelle übernommen)

- Keine erfundenen Fakten. Was nicht dokumentiert ist, steht hier nicht.
- Angaben mit Zeitbezug werden mit Stand/Datum geführt.
- Zugangscodes, Schlüsselbox-Codes und WLAN-Passwörter sind **keine** Stammdaten und
  gehören nicht in dieses Repository.
- Bei abweichenden früheren Angaben gilt der neuere Stand; Abweichungen werden benannt.

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `00-stammdaten.md` | Betreiber, Systeme, Grundstandard, Bewertungsziel |
| `betrieb.md` | Preislogik, Prozesse, Firmen- und Langzeitaufenthalte |
| `gaestekommunikation.md` | Ton, Ablauf vor/während/nach dem Aufenthalt, Fallmuster |
| `team-housekeeping.md` | Rolle, Einsatzzeiten, Vergütungsrahmen |
| `marketing.md` | Marke, Website, Direktbuchung, Social Media |
| `entwicklung.md` | Geplante Objekte und Ausbaustrategie |
| `vorlagen-kommunikationsbausteine.md` | Wiederverwendbare Bausteine |
| `AUSWERTUNG.md` | Widersprüche, Lücken und offene Entscheidungen |

## Objektdaten

Objekt- und Einheitendaten stehen **nicht** hier, sondern maschinenlesbar in
[`content/objekte.json`](../../content/objekte.json). Das ist die einzige Quelle
für Namen, Kapazitäten, Ausstattung und Preisangaben — damit Website und
Smoobu-Abgleich nicht auseinanderlaufen.

## Nicht übernommen

Personenbezogene Einzelfälle aus der Quelle sind hier bewusst nicht enthalten:
Gästenamen mit Buchungs- und Beschwerdedetails, Namen und Stundenlöhne von
Reinigungskräften, namentliche Vorfälle mit Monteuren und deren Vorgesetzten,
Zahlungen einzelner Langzeitmieter. Details und Begründung: `AUSWERTUNG.md`,
Abschnitt „Personenbezogene Daten“.

Die fachlichen Muster aus diesen Fällen — also was daraus als Regel folgt — sind
depersonalisiert in `gaestekommunikation.md` und `betrieb.md` erhalten.
