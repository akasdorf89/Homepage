# Homepage

Objektübergreifende Website für die Ferienwohnungen **Rosenhof zur Weser**
(Höxter-Stahle) und **Haus am Beckerberg** (Bad Grund im Harz), mit dem Ziel,
Direktbuchungen zu fördern.

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `content/objekte.json` | Objekte und Einheiten – redaktionelle Quelle für die Website |
| `lib/content.mjs` | Zugriff auf die Objektdaten, Abgleich mit Smoobu |
| `lib/smoobu.mjs` | Smoobu-API-Client (nur lesende Endpunkte) |
| `scripts/smoobu-check.mjs` | Verbindungstest und Zuordnungsabgleich |
| `docs/wissensbasis/` | Betriebswissen: Preise, Prozesse, Kommunikation, Marke |
| `docs/wissensbasis/AUSWERTUNG.md` | Widersprüche, Lücken und offene Entscheidungen |

Arbeitsteilung: `content/objekte.json` liefert Texte und Stammdaten, Smoobu liefert
Verfügbarkeiten und aktuelle Preise. Verknüpft wird über `smoobuApartmentId` je Einheit.

## Smoobu-Anbindung

### Einrichtung

1. API-Key in Smoobu erzeugen: **Einstellungen → Für Entwickler → API-Key**.
2. Key als Umgebungsvariable setzen (siehe `.env.example`):

   ```sh
   export SMOOBU_API_KEY="<dein-key>"
   ```

3. Verbindung testen:

   ```sh
   node scripts/smoobu-check.mjs
   ```

   Bei Erfolg werden Konto, alle Smoobu-Apartments und der Abgleich mit
   `content/objekte.json` ausgegeben – inklusive der Einheiten, denen noch eine
   `smoobuApartmentId` fehlt.

### Nutzung

```js
import { createClient } from './lib/smoobu.mjs';
import { reconcileWithSmoobu } from './lib/content.mjs';

const smoobu = createClient();

const { apartments: ids } = await smoobu.apartments();
const apartments = await Promise.all(ids.map((id) => smoobu.apartment(id)));
const { matched } = await reconcileWithSmoobu(apartments);

const preise = await smoobu.rates({
  apartments: ids,
  startDate: '2026-10-01',
  endDate: '2026-10-14',
});
```

Verfügbare Methoden: `me()`, `apartments()`, `apartment(id)`, `rates({...})`,
`reservations({...})` sowie `request(path, options)` für weitere Endpunkte. Alle
lesend – der Client schreibt nichts nach Smoobu zurück.

Der API-Key gehört ausschließlich auf den Server – er darf nicht in Client-Code
oder ins Repository gelangen.

## Datenpflege

Preisangaben in `content/objekte.json` tragen ein Feld `art`:

- `regel` – als allgemeingültig dokumentiert, für die Website verwendbar
- `richtwert` / `beispiel` – dokumentierter Einzelfall, **nicht** als Preis ausspielen
- `einzelfall` – einmalig verhandelt

Personenbezogene Daten von Gästen, Mitarbeitenden und Monteuren gehören nicht in dieses
Repository; die Begründung steht in `docs/wissensbasis/AUSWERTUNG.md`, Abschnitt 5.
