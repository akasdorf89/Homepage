#!/usr/bin/env node
/**
 * Verbindungstest gegen die Smoobu-API.
 *
 * Aufruf:  SMOOBU_API_KEY=... node scripts/smoobu-check.mjs
 */

import { createClient, SmoobuError } from '../lib/smoobu.mjs';
import { reconcileWithSmoobu } from '../lib/content.mjs';

async function main() {
  const client = createClient();

  const account = await client.me();
  console.log('✓ Verbindung zu Smoobu steht.');
  console.log(`  Konto: ${account.firstName ?? ''} ${account.lastName ?? ''}`.trimEnd());
  if (account.email) console.log(`  E-Mail: ${account.email}`);

  const { apartments: ids = [] } = await client.apartments();
  const apartments = await Promise.all(ids.map((id) => client.apartment(id)));
  console.log(`  Apartments in Smoobu: ${apartments.length}`);
  for (const apartment of apartments) {
    console.log(`    - ${apartment.id}: ${apartment.name ?? '(ohne Namen)'}`);
  }

  const { matched, unmatched, unknown } = await reconcileWithSmoobu(apartments);
  console.log('\nAbgleich mit content/objekte.json:');
  for (const { unit, apartment } of matched) {
    console.log(`  ✓ ${unit.objektName} / ${unit.name} → ${apartment.name}`);
  }
  for (const unit of unmatched) {
    console.log(`  ? ${unit.objektName} / ${unit.name} – keine smoobuApartmentId gepflegt`);
  }
  for (const apartment of unknown) {
    console.log(`  ! Smoobu-Apartment ${apartment.id} (${apartment.name}) – keine Einheit im Content`);
  }
  if (unmatched.length || unknown.length) {
    console.log('\n  Zuordnung in content/objekte.json über "smoobuApartmentId" je Einheit ergänzen.');
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
