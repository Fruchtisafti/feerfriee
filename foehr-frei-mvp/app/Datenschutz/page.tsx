import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz – Föhr Frei',
  description: 'Informationen zum Datenschutz für Föhr Frei.',
};

export default function DatenschutzPage() {
  return (
    <main className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Datenschutzerklärung</h1>
      <p className="mb-4">
        Dies ist ein Prototyp (MVP). Hier stehen die Hinweise zum Datenschutz.
      </p>
      <p className="text-sm text-slate-500">Kontakt: info@example.com</p>
    </main>
  );
}
