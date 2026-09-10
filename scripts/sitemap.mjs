#!/usr/bin/env node
/**
 * Gibt die geplante Seitenstruktur aus.
 *
 * Aufruf:  node scripts/sitemap.mjs
 */

import { loadSite, buildSitemap, buildRedirects, absoluteUrl, isBrandDecided } from '../lib/site.mjs';

const TYP_LABEL = {
  start: 'Start',
  objekt: 'Objekt',
  einheit: 'Einheit',
  inhalt: 'Inhalt',
  rechtlich: 'Recht',
};

async function main() {
  const site = await loadSite();
  const seiten = await buildSitemap();
  const redirects = await buildRedirects();

  console.log(`Marke:  ${site.marke.name}${site.marke.status === 'offen' ? '  (noch nicht entschieden)' : ''}`);
  console.log(`Domain: ${site.domain.haupt}${site.domain.status === 'offen' ? '  (noch nicht entschieden)' : ''}`);
  console.log(`Struktur: ${site.domain.struktur === 'pfad' ? 'Objekte als Pfade unter der Hauptdomain' : site.domain.struktur}\n`);

  console.log(`Seiten (${seiten.length}):`);
  for (const seite of seiten) {
    const typ = (TYP_LABEL[seite.typ] ?? seite.typ).padEnd(8);
    const offen = [];
    if (seite.typ === 'einheit' && seite.smoobuApartmentId == null) offen.push('keine Smoobu-ID');
    if (seite.status === 'fehlt') offen.push('Inhalt fehlt');
    const marker = offen.length ? `   ← ${offen.join(', ')}` : '';
    console.log(`  ${typ} ${seite.pfad.padEnd(38)} ${seite.titel}${marker}`);
  }

  if (redirects.length) {
    console.log('\nWeiterleitungen:');
    for (const redirect of redirects) {
      console.log(`  ${redirect.typ}  ${redirect.von} → ${await absoluteUrl(redirect.nach)}`);
      if (redirect.hinweis) console.log(`       ${redirect.hinweis}`);
    }
  }

  if (!(await isBrandDecided())) {
    console.log('\nHinweis: Marke und Domain sind Platzhalter aus content/site.json.');
    console.log('Sobald sie feststehen, reicht eine Änderung dort – die Struktur bleibt.');
  }
}

main().catch((error) => {
  console.error(`✗ ${error.message}`);
  process.exitCode = 1;
});
