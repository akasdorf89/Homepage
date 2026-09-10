/**
 * Dachmarke, Domain und Seitenstruktur.
 *
 * Name und Domain stehen noch nicht fest. Beide sind deshalb ausschließlich in
 * content/site.json hinterlegt und werden von hier aus verteilt – die Seitenstruktur
 * darunter ist bereits final und ändert sich durch die Namensentscheidung nicht.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { loadContent } from './content.mjs';

const SITE_URL = new URL('../content/site.json', import.meta.url);

let cache;

/** Lädt die Seitenkonfiguration (einmalig, danach aus dem Cache). */
export async function loadSite() {
  if (!cache) {
    cache = JSON.parse(await readFile(fileURLToPath(SITE_URL), 'utf8'));
  }
  return cache;
}

/** Slug eines Objekts oder einer Einheit – `slug`, sonst `id`. */
export function slugOf(entry) {
  return entry.slug ?? entry.id;
}

/** Pfad einer Objektseite, z. B. `/rosenhof-zur-weser/`. */
export function objektPath(objekt) {
  return `/${slugOf(objekt)}/`;
}

/** Pfad einer Einheitenseite, z. B. `/haus-am-beckerberg/einhorn/`. */
export function einheitPath(objekt, einheit) {
  return `/${slugOf(objekt)}/${slugOf(einheit)}/`;
}

/**
 * Absolute URL zu einem Pfad.
 *
 * Solange die Domain nicht feststeht, bleibt der Platzhalter aus site.json sichtbar –
 * absichtlich, damit eine versehentlich veröffentlichte URL sofort auffällt.
 */
export async function absoluteUrl(pfad) {
  const { domain } = await loadSite();
  const host = domain.wwwPraefix ? `www.${domain.haupt}` : domain.haupt;
  return `${domain.protokoll}://${host}${pfad}`;
}

/** True, sobald Marke und Domain entschieden sind. */
export async function isBrandDecided() {
  const { marke, domain } = await loadSite();
  return marke.status !== 'offen' && domain.status !== 'offen';
}

/**
 * Vollständige Seitenliste der Website.
 *
 * Entsteht aus site.json plus content/objekte.json, damit ein neues Objekt oder eine
 * neue Wohnung automatisch eigene Seiten bekommt, ohne dass hier etwas anzupassen ist.
 */
export async function buildSitemap() {
  const site = await loadSite();
  const { objekte } = await loadContent();

  const seiten = [
    { pfad: site.seiten.start.pfad, titel: site.seiten.start.titel, typ: 'start' },
  ];

  for (const objekt of objekte) {
    seiten.push({
      pfad: objektPath(objekt),
      titel: `${objekt.name} – ${objekt.region}`,
      typ: 'objekt',
      objektId: objekt.id,
    });

    for (const einheit of objekt.einheiten) {
      seiten.push({
        pfad: einheitPath(objekt, einheit),
        titel: `${einheit.name} – ${objekt.name}`,
        typ: 'einheit',
        objektId: objekt.id,
        einheitId: einheit.id,
        smoobuApartmentId: einheit.smoobuApartmentId,
      });
    }
  }

  for (const seite of site.seiten.weitere) {
    seiten.push({ pfad: seite.pfad, titel: seite.titel, typ: 'inhalt' });
  }

  for (const seite of site.seiten.rechtlich) {
    seiten.push({ pfad: seite.pfad, titel: seite.titel, typ: 'rechtlich', status: seite.status });
  }

  return seiten;
}

/** Weiterleitungen von bestehenden Domains auf die Hauptdomain. */
export async function buildRedirects() {
  const site = await loadSite();
  const { objekte } = await loadContent();

  return site.domain.bestehende.map((eintrag) => {
    const objekt = objekte.find((o) => eintrag.verwendung.includes(slugOf(o)));
    return {
      von: eintrag.domain,
      nach: objekt ? objektPath(objekt) : '/',
      typ: 301,
      hinweis: eintrag.hinweis,
    };
  });
}
