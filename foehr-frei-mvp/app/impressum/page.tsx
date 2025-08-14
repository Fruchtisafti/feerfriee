import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum – Föhr Frei',
  description: 'Impressumsangaben für Föhr Frei.',
};

export default function ImpressumPage() {
  return (
    <main className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Impressum</h1>
      <p className="mb-4">
        Föhr Frei (MVP) – Beispielangaben. Ersetze diese durch echte Daten.
      </p>
      <p className="text-sm text-slate-500">
        E-Mail: info@example.com
      </p>
    </main>
  );
}
