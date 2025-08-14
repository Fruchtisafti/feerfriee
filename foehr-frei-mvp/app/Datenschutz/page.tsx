// app/datenschutz/page.tsx
export const metadata = {
  title: 'Datenschutzerklärung – Föhr Frei',
};

export default function DatenschutzPage() {
  return (
    <main className="min-h-[60vh] bg-cloud px-4 py-8">
      <div className="mx-auto max-w-3xl bg-white p-6 rounded-xl border shadow-soft">
        <h1 className="text-2xl font-semibold text-navy mb-4">Datenschutzerklärung</h1>

        <p className="text-navy/70 text-sm mb-6">
          Hinweis: Diese Vorlage ist kein Rechtsrat. Bitte prüfe/ergänze sie für deinen Anwendungsfall.
        </p>

        <section className="space-y-3 text-navy/90">
          <h2 className="text-lg font-semibold">1. Verantwortlicher</h2>
          <p>[Name/Anschrift wie im Impressum] · E-Mail: [deine@mail.de]</p>

          <h2 className="text-lg font-semibold mt-4">2. Hosting</h2>
          <p>Diese Website wird bei Vercel, Inc. gehostet. Es können Server-Logfiles (IP-Adresse, Datum/Zeit, User-Agent) verarbeitet werden, um die Stabilität und Sicherheit zu gewährleisten.</p>

          <h2 className="text-lg font-semibold mt-4">3. Zugriffsdaten/Logfiles</h2>
          <p>Bei jedem Aufruf werden automatisch technische Informationen erfasst. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an technischer Bereitstellung/Sicherheit).</p>

          <h2 className="text-lg font-semibold mt-4">4. Cookies & Einwilligung</h2>
          <p>Wir verwenden notwendige Cookies/Funktionen. Statistik/Werbung laden wir nur mit deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Du kannst deine Entscheidung jederzeit im Browser löschen oder in den Einstellungen ändern.</p>

          <h2 className="text-lg font-semibold mt-4">5. Kontakt</h2>
          <p>Wenn du uns kontaktierst, verarbeiten wir die Angaben zur Bearbeitung deiner Anfrage (Art. 6 Abs. 1 lit. b/f DSGVO).</p>

          <h2 className="text-lg font-semibold mt-4">6. Rechte der Betroffenen</h2>
          <p>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch (Art. 15–21 DSGVO). Außerdem besteht ein Beschwerderecht bei einer Aufsichtsbehörde.</p>

          <h2 className="text-lg font-semibold mt-4">7. Drittlandtransfer</h2>
          <p>Sofern Dienste in Drittländern eingesetzt werden, erfolgt dies unter Einhaltung der DSGVO (z. B. Standardvertragsklauseln).</p>

          <h2 className="text-lg font-semibold mt-4">8. Stand</h2>
          <p>[Datum einsetzen]</p>
        </section>
      </div>
    </main>
  );
}
