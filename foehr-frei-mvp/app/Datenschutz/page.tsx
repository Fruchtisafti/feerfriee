// app/datenschutz/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz – Föhr Frei',
  description: 'Informationen zum Datenschutz für Föhr Frei.',
};

export default function DatenschutzPage() {
  return (
    <main className="prose prose-slate max-w-3xl">
      <h1>Datenschutzerklärung</h1>

      <h2>1. Verantwortlicher</h2>
      <p>
        Föhr Frei (MVP)<br/>
        Kontakt: info@example.com
      </p>

      <h2>2. Erhobene Daten</h2>
      <p>
        Beim Besuch dieser Website werden serverseitig technisch notwendige Daten (z. B. IP-Adresse, Zeitpunkt, User-Agent) verarbeitet. 
        Außerdem speichern wir lokal in Ihrem Browser (localStorage) nur die von Ihnen eingegebenen Demo-Daten.
      </p>

      <h2>3. Cookies & Einwilligungen</h2>
      <p>
        Optionale Dienste (z. B. Web-Analytics, Werbung) werden nur nach Ihrer Einwilligung geladen. 
        Sie können Ihre Auswahl jederzeit im Cookie‑Banner anpassen.
      </p>

      <h2>4. Drittdienste</h2>
      <p>
        Beim Einbinden externer Inhalte (z. B. Bilder) können Anfragen an die Server der jeweiligen Anbieter erfolgen.
      </p>

      <h2>5. Ihre Rechte</h2>
      <p>
        Sie haben u. a. das Recht auf Auskunft, Berichtigung und Löschung. 
        Wenden Sie sich dazu an: info@example.com
      </p>

      <h2>6. Kontakt</h2>
      <p>
        Fragen zum Datenschutz: info@example.com
      </p>

      <p className="text-sm text-slate-500">
        Hinweis: Diese Seite ist ein Prototyp (MVP) und ersetzt keine Rechtsberatung.
      </p>
    </main>
  );
}
