'use client';

import { useEffect, useState } from 'react';

type Listing = {
  id: number;
  title: string;
  location: string;
  price: number;
  available: boolean;
  image: string;
};

export default function Page() {
  const [tab, setTab] = useState<'guest' | 'host'>('guest');
  const [search, setSearch] = useState('');

  // Hash ↔ Tab synchronisieren
  useEffect(() => {
    const applyHash = () => {
      const h = typeof window !== 'undefined' ? window.location.hash : '';
      if (h === '#vermieter') setTab('host');
      else setTab('guest'); // default + #gaeste
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  // Demo-Daten
  const listings: Listing[] = [
    { id: 1, title: 'Nordseeperle', location: 'Wyk auf Föhr', price: 120, available: true,
      image: 'https://picsum.photos/seed/foehr1/800/600' },
    { id: 2, title: 'Dünenblick', location: 'Nieblum', price: 95, available: false,
      image: 'https://picsum.photos/seed/foehr2/800/600' },
    { id: 3, title: 'Inseltraum', location: 'Utersum', price: 150, available: true,
      image: 'https://picsum.photos/seed/foehr3/800/600' },
  ];

  const filtered = listings.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-cloud px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-navy mb-8">Föhr Frei</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            aria-pressed={tab === 'guest'}
            className={`px-3 py-2 rounded-lg border transition shadow-soft ${
              tab === 'guest' ? 'bg-north text-white' : 'bg-cloud text-navy hover:bg-white'
            }`}
            onClick={() => {
              setTab('guest');
              if (typeof window !== 'undefined') {
                window.history.replaceState(null, '', '#gaeste');
                // optional smooth scroll:
                // document.getElementById('gaeste')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Für Gäste
          </button>

          <button
            type="button"
            aria-pressed={tab === 'host'}
            className={`px-3 py-2 rounded-lg border transition shadow-soft ${
              tab === 'host' ? 'bg-north text-white' : 'bg-cloud text-navy hover:bg-white'
            }`}
            onClick={() => {
              setTab('host');
              if (typeof window !== 'undefined') {
                window.history.replaceState(null, '', '#vermieter');
                // optional smooth scroll:
                // document.getElementById('vermieter')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Für Vermieter
          </button>
        </div>

        {tab === 'guest' ? (
          <section id="gaeste">
            {/* Search */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Suche nach Ort oder Name"
                className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-north/40"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={() => setSearch('')}
                className="rounded-lg px-3 py-2 bg-cloud hover:bg-white border"
              >
                Reset
              </button>
            </div>

            {/* Listings */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((l) => (
                <div
                  key={l.id}
                  className="border rounded-xl shadow-soft bg-white overflow-hidden"
                >
                  <img
                    src={l.image}
                    alt={l.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-navy">{l.title}</h2>
                    <p className="text-sm text-navy/70">{l.location}</p>

                    <div className="mt-auto flex justify-between items-center">
                      <span className="font-bold text-north">{l.price} €</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          l.available ? 'bg-sea/10 text-sea' : 'bg-coral/10 text-coral'
                        }`}
                      >
                        {l.available ? 'Frei' : 'Belegt'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section id="vermieter" className="rounded-xl border bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-navy mb-2">Für Vermieter</h2>
            <p className="text-navy/70 mb-4">
              Trage hier demnächst deine Unterkunft ein und synchronisiere deinen Kalender (ICS).
            </p>
            <ul className="list-disc pl-5 text-navy/80 space-y-1">
              <li>Kalender-URL (iCal/ICS) einfügen</li>
              <li>Automatische Erkennung freier Zeitfenster</li>
              <li>Direktlink zu deiner Buchungsseite</li>
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
import ContactForm from '@/components/ContactForm';

// ...innerhalb deines JSX:
<section id="kontakt" className="mt-16 rounded-xl border bg-white p-6 shadow-soft">
  <h2 className="text-xl font-semibold text-navy mb-2">Kontakt</h2>
  <p className="text-navy/70 mb-4">
    Fragen, Feedback, Interesse als Vermieter? Schreib uns kurz – wir melden uns.
  </p>
  <ContactForm />
</section>
