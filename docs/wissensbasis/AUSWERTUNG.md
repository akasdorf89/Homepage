# Auswertung des Datenbestands

Ergebnis der Durchsicht aller 14 Quelldateien (Stand 10.09.2026). Festgehalten sind
Widersprüche, Lücken und Entscheidungen, die vor dem Bau der Website zu klären sind.

## 1. Widersprüche in den Preisangaben

### Reinigung Rosenhof zur Weser — fünf verschiedene Werte

| Wert | Kontext in der Quelle |
| --- | --- |
| 55 € | „Endreinigung“ |
| 120 € | „Grundreinigung pro Wohnung“, Booking-Kontext |
| 65 € / 95 € | Zwischenreinigung klein / groß |
| 49 € | im Reklamationsfall als „komplette Reinigungsgebühr“ erstattet |
| 129 € | in einem Angebot für Das Quartier ausgewiesen |

Diese Werte lassen sich nicht auf ein Modell zurückführen. Für die Website wird ein
Reinigungspreis **pro Einheit** gebraucht — aktuell nicht ableitbar.

### Reinigung Haus am Beckerberg

65–69 € genannt, ohne Zuordnung zu einer der drei Wohnungen.

### Hundegebühr — zwei unvereinbare Modelle

- Harz: 25 € einmalig.
- Stahle: 6 € pro Nacht (Einzelfall vom 05.09.2026).

Bei sieben Nächten ergibt das 25 € gegenüber 42 €. Ob das bewusst objektabhängig ist oder
ein Einzelfall war, geht aus der Quelle nicht hervor.

### Zusätzliche Person

Regulär 25 €/Nacht, in einem Fall 15 €/Nacht angeboten.

### Nicht website-taugliche Preisbeispiele

„FeWo Kobold 35 €/Nacht" und „Rosenhof ca. 100 €/Nacht" sind in der Quelle ausdrücklich
als Beispiele markiert. Sie sind in `content/objekte.json` als `"art": "beispiel"`
gekennzeichnet und dürfen **nicht** als Preise ausgespielt werden.

## 2. Ungeklärte Regelstände

- **Kurtaxe bei Geschäftsreisen** (Harz): „entfällt" stammt aus einem älteren
  Prozessstand. Gilt das noch? Relevant, weil Das Quartier gezielt Firmen anspricht —
  allerdings liegt Das Quartier in Stahle, nicht im Harz.
- **Kurtaxe Stahle**: in der gesamten Quelle nicht erwähnt. Fällt dort keine an?
- **Stornierung**: „24 Stunden vorher“ stammt aus einem Einzelkontext. Für Direktbuchungen
  über die eigene Website wird eine verbindliche, in AGB formulierte Regel gebraucht.
- **Schlüsselbox Beckerberg**: „links neben dem Eingang“ gegenüber „links neben Eingang,
  rechts neben Briefkästen“. Vor Ort abgleichen.

## 3. Lücken für die Website

### Adressen unvollständig

- **Haus am Beckerberg**: nur „Helmkampff-Straße“ — Hausnummer und PLZ fehlen.
  Beides wird für Impressum, Google Business und strukturierte Daten
  (`schema.org/LodgingBusiness`) benötigt.
- **Rosenhof**: Stammdaten nennen „Alter Kirchweg“, die Gästekommunikation
  „Alter Kirchweg 1, 37671“. Der genauere Wert ist übernommen, sollte aber bestätigt werden.

### Ausstattung stark unausgewogen

Von sechs Einheiten ist nur **Das Quartier** ausstattungsseitig beschrieben. Für die
anderen fünf — Fachwerktraum, Blick ins Grüne, Einhorn, Kobold, Drachen — liegen praktisch
nur Lage und Bettenzahl vor. Für Buchungsseiten fehlen durchgehend:

- Quadratmeter, Zimmeraufteilung, konkrete Bettenkonfiguration
- Küchen- und Badausstattung, WLAN, TV, Waschmaschine
- Fotos (in der gesamten Quelle nicht enthalten)
- Preise und Saisonzeiten

### Sauna

Nur beim Haus am Beckerberg dokumentiert. Ob sie allen drei Wohnungen offensteht oder nur
bestimmten, ist nicht festgehalten.

### Rechtliches

Impressum, Datenschutzerklärung, AGB und der umsatzsteuerliche Status sind in der Quelle
nicht behandelt und für eine buchbare Website zwingend.

## 4. Verknüpfung zu Smoobu fehlt

Smoobu ist als Channel Manager aktiv, aber die Quelle nennt keine Apartment-IDs. Ohne sie
lassen sich Verfügbarkeiten und Live-Preise nicht den sechs Einheiten zuordnen.

In `content/objekte.json` steht deshalb bei jeder Einheit `"smoobuApartmentId": null`.
`scripts/smoobu-check.mjs` listet nach erfolgreicher Verbindung alle Smoobu-Apartments und
zeigt an, welche Zuordnung noch fehlt. Das ist der erste Schritt, sobald ein gültiger
API-Key vorliegt.

## 5. Personenbezogene Daten

Drei Quelldateien enthalten Daten Dritter, die nicht in ein Git-Repository gehören:

| Quelldatei | Inhalt |
| --- | --- |
| `gaestekommunikation/dokumentierte_faelle.md` | 13 Gäste mit Klarnamen, dazu Wohnung, Zeitraum, Hund, Beschwerden, Stornierungen, Zahlungsbeträge |
| `team/housekeeping.md` | Namen von Reinigungskräften mit individuellen Stundenlöhnen und Vertragsständen |
| `betrieb/monteure_langzeit.md` | Namen von Monteuren und Vorgesetzten, dokumentierte Abmahnungen, Zahlungen eines Langzeitmieters |

Das sind personenbezogene Daten im Sinne der DSGVO, teils besonders heikel
(Beschwerdehistorie, Abmahnungen, Gehälter). Git speichert sie dauerhaft in der Historie —
ein späteres Löschen erfordert das Umschreiben der History und greift nicht bei bereits
gezogenen Klonen. Bei einem öffentlichen Repository wären sie zusätzlich indexierbar.

**Übernommen wurde deshalb nur die fachliche Essenz**, depersonalisiert:

- Die Reaktionsmuster aus den Gästefällen → `gaestekommunikation.md`, Abschnitt
  „Wiederkehrende Situationen“.
- Der Vergütungs- und Einsatzrahmen ohne Namen → `team-housekeeping.md`.
- Hausregeln, Preisverhandlungslogik und Eskalationspraxis ohne Namen → `betrieb.md`.

Die namentlichen Originaldaten gehören stattdessen dorthin, wo sie ohnehin schon liegen und
wo Löschfristen greifen: die Gastdaten in Smoobu, die Personalunterlagen in die
Personalablage. Falls du sie doch versioniert brauchst, wäre ein getrenntes privates
Repository der richtige Ort — nicht dieses, das später die öffentliche Website trägt.

## 6. Nächste Schritte

1. Gültigen Smoobu-API-Key hinterlegen, `scripts/smoobu-check.mjs` laufen lassen und die
   `smoobuApartmentId` je Einheit eintragen.
2. Markenentscheidung treffen — sie blockiert Domain, Logo, Impressum und sämtliche Texte.
   Empfehlung aus der Quelle war „Kasdorf Living“, bestätigt ist sie nicht.
3. Reinigungspreise und Hundegebühr je Einheit verbindlich festlegen.
4. Adresse Beckerberg vervollständigen.
5. Ausstattungsdaten und Fotos für die fünf unterdokumentierten Einheiten erheben.
6. Rechtstexte klären (Impressum, Datenschutz, AGB, USt-Status).
