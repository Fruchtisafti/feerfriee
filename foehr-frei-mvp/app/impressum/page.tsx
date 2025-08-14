// app/impressum/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum – Föhr Frei',
  description: 'Impressumsangaben für Föhr Frei.',
};

export default function ImpressumPage() {
  return (
    <main className="prose prose-slate max-w-3xl">
      <h1>Impressum</h1>
      <p>
        Angaben gemäß § 5 TMG<br/>
        Föhr Frei (MVP)<br/>
        Musterstraße 1<br/>
        25938 Wyk auf Föhr
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: info@example.com
      </p>

      <h2>Haftungsausschluss</h2>
      <p>
        Inhalte ohne Gewähr. Für externe Links wird keine Haftung übernommen; 
        für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
      </p>

      <p className="text-sm text-slate-500">
        Hinweis: Prototyp (MVP). Ersetzt keine Rechtsberatung.
      </p>
    </main>
  );
}
