// app/impressum/page.tsx
export const metadata = {
  title: 'Impressum – Föhr Frei',
};

export default function ImpressumPage() {
  return (
    <main className="min-h-[60vh] bg-cloud px-4 py-8">
      <div className="mx-auto max-w-3xl bg-white p-6 rounded-xl border shadow-soft">
        <h1 className="text-2xl font-semibold text-navy mb-4">Impressum</h1>

        {/* TODO: Ersetze die Platzhalter unten mit deinen echten Daten */}
        <section className="space-y-1 text-navy/90">
          <p><strong>Anbieter:</strong> [Vorname Nachname / Firma]</p>
          <p><strong>Adresse:</strong> [Straße Hausnummer], [PLZ] [Ort], [Land]</p>
          <p><strong>Kontakt:</strong> E-Mail: [deine@mail.de], Telefon: [optional]</p>
          <p><strong>Vertretungsberechtigt:</strong> [falls Firma]</p>
          <p><strong>USt-IdNr.:</strong> [falls vorhanden]</p>
        </section>

        <hr className="my-6"/>

        <section className="space-y-2 text-navy/80 text-sm">
          <p><strong>Inhaltlich Verantwortlicher</strong> gem. § 55 Abs. 2 RStV: [Name, Anschrift]</p>
          <p>EU-Streitschlichtung: <a className="underline" href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer">ec.europa.eu/consumers/odr</a></p>
          <p>Haftung für Inhalte/Links: Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für externe Links. Für den Inhalt verlinkter Seiten sind ausschließlich deren Betreiber verantwortlich.</p>
        </section>
      </div>
    </main>
  );
}
