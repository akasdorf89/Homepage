/**
 * Zugriff auf die gepflegten Objektdaten (content/objekte.json).
 *
 * Die Datei ist die redaktionelle Quelle für Objekt- und Einheitentexte.
 * Verfügbarkeiten und Preise kommen dagegen live aus Smoobu (lib/smoobu.mjs).
 * Beide Seiten werden über `smoobuApartmentId` je Einheit verknüpft.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const DATA_URL = new URL('../content/objekte.json', import.meta.url);

let cache;

/** Lädt die Objektdaten (einmalig, danach aus dem Cache). */
export async function loadContent() {
  if (!cache) {
    cache = JSON.parse(await readFile(fileURLToPath(DATA_URL), 'utf8'));
  }
  return cache;
}

/** Alle Einheiten beider Objekte, jeweils mit Rückverweis auf das Objekt. */
export async function listUnits() {
  const { objekte } = await loadContent();
  return objekte.flatMap((objekt) =>
    objekt.einheiten.map((einheit) => ({
      ...einheit,
      objektId: objekt.id,
      objektName: objekt.name,
      region: objekt.region,
    })),
  );
}

/** Einheit anhand der Smoobu-Apartment-ID finden. */
export async function findUnitBySmoobuId(apartmentId) {
  const units = await listUnits();
  return units.find((unit) => unit.smoobuApartmentId === apartmentId);
}

/**
 * Gleicht die Smoobu-Apartments mit den gepflegten Einheiten ab.
 *
 * Liefert drei Gruppen, damit sichtbar wird, wo die Zuordnung noch fehlt:
 * - `matched`   – Einheit und Smoobu-Apartment verknüpft
 * - `unmatched` – Einheit ohne `smoobuApartmentId`
 * - `unknown`   – Smoobu-Apartment ohne passende Einheit im Content
 */
export async function reconcileWithSmoobu(smoobuApartments) {
  const units = await listUnits();
  const byId = new Map(smoobuApartments.map((apartment) => [apartment.id, apartment]));

  const matched = [];
  const unmatched = [];

  for (const unit of units) {
    const apartment = unit.smoobuApartmentId != null ? byId.get(unit.smoobuApartmentId) : undefined;
    if (apartment) {
      matched.push({ unit, apartment });
      byId.delete(unit.smoobuApartmentId);
    } else {
      unmatched.push(unit);
    }
  }

  return { matched, unmatched, unknown: [...byId.values()] };
}
