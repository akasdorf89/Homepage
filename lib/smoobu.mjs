/**
 * Minimaler Smoobu-API-Client (ohne externe Abhängigkeiten).
 *
 * Auth: Smoobu erwartet den API-Key im Header `Api-Key`.
 * Den Key findest du in Smoobu unter: Einstellungen -> Für Entwickler -> API-Key.
 * Doku: https://docs.smoobu.com/
 */

const BASE_URL = 'https://login.smoobu.com/api';

export class SmoobuError extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.name = 'SmoobuError';
    this.status = status;
    this.body = body;
  }
}

export function createClient({ apiKey = process.env.SMOOBU_API_KEY, baseUrl = BASE_URL } = {}) {
  if (!apiKey) {
    throw new SmoobuError('SMOOBU_API_KEY ist nicht gesetzt.');
  }

  async function request(path, { method = 'GET', query, body } = {}) {
    const url = new URL(baseUrl + path);
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const item of value) url.searchParams.append(`${key}[]`, String(item));
      } else {
        url.searchParams.set(key, String(value));
      }
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Api-Key': apiKey,
        'Cache-Control': 'no-cache',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const text = await response.text();
    let payload = text;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      // Antwort ist kein JSON – Rohtext behalten.
    }

    if (!response.ok) {
      const detail = (payload && payload.detail) || response.statusText;
      throw new SmoobuError(`Smoobu ${method} ${path} fehlgeschlagen (${response.status}): ${detail}`, {
        status: response.status,
        body: payload,
      });
    }

    return payload;
  }

  return {
    request,
    /** Kontodaten des API-Keys – eignet sich als Verbindungstest. */
    me: () => request('/me'),
    /** Liste der Apartment-IDs. */
    apartments: () => request('/apartments'),
    /** Details zu einem Apartment. */
    apartment: (id) => request(`/apartments/${id}`),
    /** Preise und Verfügbarkeit im Zeitraum (Datumsformat: YYYY-MM-DD). */
    rates: ({ apartments, startDate, endDate }) =>
      request('/rates', { query: { apartments, start_date: startDate, end_date: endDate } }),
    /** Buchungen, gefiltert z. B. nach Zeitraum oder Apartment. */
    reservations: (query = {}) => request('/reservations', { query }),
  };
}

export default createClient;
