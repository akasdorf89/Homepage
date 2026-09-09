#!/usr/bin/env node
/**
 * Verbindungstest gegen die Smoobu-API.
 *
 * Aufruf:  SMOOBU_API_KEY=... node scripts/smoobu-check.mjs
 */

import { createClient, SmoobuError } from '../lib/smoobu.mjs';

async function main() {
  const client = createClient();

  const account = await client.me();
  console.log('✓ Verbindung zu Smoobu steht.');
  console.log(`  Konto: ${account.firstName ?? ''} ${account.lastName ?? ''}`.trimEnd());
  if (account.email) console.log(`  E-Mail: ${account.email}`);

  const { apartments = [] } = await client.apartments();
  console.log(`  Apartments: ${apartments.length}`);

  for (const id of apartments) {
    const details = await client.apartment(id);
    console.log(`    - ${id}: ${details.name ?? '(ohne Namen)'}`);
  }
}

main().catch((error) => {
  if (error instanceof SmoobuError) {
    console.error(`✗ ${error.message}`);
    if (error.status === 401) {
      console.error('  Der API-Key wird von Smoobu abgelehnt.');
      console.error('  Neuen Key holen: Smoobu -> Einstellungen -> Für Entwickler -> API-Key.');
    }
  } else {
    console.error(`✗ Unerwarteter Fehler: ${error.message}`);
  }
  process.exitCode = 1;
});
