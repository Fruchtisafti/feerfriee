'use client';

import { useEffect, useMemo, useState } from 'react';
import ContactForm from '@/components/ContactForm';

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

  // Hash ↔ Tab synchronisieren (#gaeste / #vermieter)
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

  // Demo-Daten (Platzhalter)
  const listings: Listing[] = useMemo(
    () => [
      {
        id: 1,
        title: 'Nordseeperle',
        location: 'Wyk auf Föhr',
        price: 120,
        available: true,
        image: 'https://picsum.photos/seed/foehr1/800/600',
      },
      {
        id: 2,
        title: 'Dünenblick',
        location: 'Nieblum',
        price: 95,
        available: false,
        image: 'https://picsum.photos/seed/foehr2/800/600',
      },
      {
        id: 3,
        title: 'Inseltraum',
        location: 'Utersum',
        price: 150,
        available: true,
        image: 'https://picsum.photos/seed/foehr3/800/600',
      },
    ],
    []
  );

  const filtered = useMemo(
    () =>
      listings.filter(
        (l) =>
          l.title.toLowerCase().includes(search.toLowerCase()) ||
          l.location.toLowerCase().includes(search.toLowerCase())
      ),
    [listings, search]
  );

  // Helper: Hash setzen beim Tab-Wechsel
  const setHash = (hash: '#gaeste' | '#vermieter') => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', hash);
    }
  };

  return (
    <main className="min-h-screen bg-cloud px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            className={`px-3 py-2 rounded-lg border transition shadow-soft ${
              tab === 'guest' ? 'bg-north text-white' : 'bg-cloud text-navy hover:bg-white'
            }`}
            onClick={() => {
              setTab('guest');
              setHash('#gaeste');
            }}
          >
            Für Gäste
          </button>
          <button
            className={`px-3 py-2 rounded-lg border transition shadow-soft ${
              tab === 'host' ? 'bg-north text-white' : 'bg-cloud text-navy hover:bg-white'
            }`}
            onClick={() => {
              setTab('host');
              setHash('#vermieter');
            }}
          >
            Für Vermieter
          </button>
        </div>

        {tab === 'guest' ? (
          <>
            {/* Suche */}
            <div className="mb-6 flex gap-2">
              <input
                type="text"
                placeholder="Suche nach Ort oder Name"
                className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-north/40"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={() => setSearch('')}
                className="rounded-lg border bg-white px-3 py-2 hover:bg-cloud"
              >
                Reset
              </button>
            </div>

            {/* Listings */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((l) => (
                <article
                  key={l.id}
                  className="overflow-hidden rounded-xl border bg-white shadow-soft"
                >
                  <img src={l.image} alt={l.title} className="h-40 w-full object-cover" />
                  <div className="flex flex-col gap-2 p-4">
                    <h2 className="text-lg font-semibold text-navy">{l.title}</h2>
                    <p className="text-sm text-navy/70">{l.location}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-bold text-north">{l.price} €</span>
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          l.available ? 'bg-sea/10 text-sea' : 'bg-coral/10 text-coral'
                        }`}
                      >
                        {l.available ? 'Frei' : 'Belegt'}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          // Vermieter-Ansicht (Platzhalter)
          <section
            id="vermieter"
            className="rounded-xl border bg-white p-6 shadow-soft"
          >
            <h2 className="mb-2 text-xl font-semibold text-navy">Für Vermieter</h2>
            <p className="mb-4 text-navy/70">
              Trage hier demnächst deine Unterkunft ein und synchronisiere deinen
              Kalender (ICS).
            </p>
            <ul className="list-disc space-y-1 pl-5 text-navy/80">
              <li>Kalender‑URL (iCal/ICS) einfügen</li>
              <li>Automatische Erkennung freier Zeitfenster</li>
              <li>Direktlink zu deiner Buchungsseite</li>
            </ul>
          </section>
        )}

        {/* Kontakt */}
        <section id="kontakt" className="mt-12 rounded-xl border bg-white p-6 shadow-soft">
          <h2 className="mb-2 text-xl font-semibold text-navy">Kontakt</h2>
          <p className="mb-4 text-navy/70">
            Fragen, Feedback oder Interesse als Vermieter? Schreib uns kurz:
          </p>
          <ContactForm />
        </section>
      </div>
    </main>
  );
}
