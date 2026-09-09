# Homepage

## Smoobu-Anbindung

Die Anbindung an die [Smoobu-API](https://docs.smoobu.com/) liegt in:

- `lib/smoobu.mjs` – schlanker API-Client ohne externe Abhängigkeiten
- `scripts/smoobu-check.mjs` – Verbindungstest

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

   Bei Erfolg werden Kontodaten und die Liste der Apartments ausgegeben.

### Nutzung

```js
import { createClient } from './lib/smoobu.mjs';

const smoobu = createClient();

const { apartments } = await smoobu.apartments();
const preise = await smoobu.rates({
  apartments,
  startDate: '2026-07-01',
  endDate: '2026-07-14',
});
```

Verfügbare Methoden: `me()`, `apartments()`, `apartment(id)`, `rates({...})`,
`reservations({...})` sowie `request(path, options)` für alle weiteren Endpunkte.

Der API-Key gehört ausschließlich auf den Server – er darf nicht in Client-Code
oder ins Repository gelangen.
