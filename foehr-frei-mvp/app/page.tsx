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

/* --- HostICSBox: ICS prüfen (ruft /api/ics/parse auf) --- */
function HostICSBox() {
  const [icsUrl, setIcsUrl] = useState('');
  const [icsText, setIcsText] = useState('');
  const [horizonDays, setHorizonDays] = useState(30);
  const [minNights, setMinNights] = useState(3);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    bookedDays: string[];
    windows: { start: string; length: number }[];
    horizonDays: number;
    countEvents: number;
  }>(null);
  const [error, setError] = useState<string | null>(null);

  // gemerkte Eingaben (kleiner UX-Bonus)
  useEffect(() => {
    const u = localStorage.getItem('ff_ics_url');
    if (u) setIcsUrl(u);
  }, []);
  useEffect(() => {
    if (icsUrl) localStorage.setItem('ff_ics_url', icsUrl);
  }, [icsUrl]);

  async function handleCheck() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/ics/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          icsUrl: icsUrl || undefined,
          icsText: icsText || undefined,
          horizonDays, // Backend kennt das bereits
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || `Fehler ${res.status}`);
      setResult(data);
    } catch (e: any) {
      setError(e?.message || 'Prüfung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  }

  // Client‑seitig nach Mindestnächten filtern
  const filteredWindows =
    result?.windows?.filter((w) => w.length >= minNights) ?? [];

  return (
    <div className="mt-6 space-y-3 rounded-lg border p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-navy/80">Kalender‑URL (ICS)</label>
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="https://…/calendar.ics"
            value={icsUrl}
            onChange={(e) => setIcsUrl(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-navy/80">Zeithorizont (Tage)</label>
            <input
              type="number"
              min={7}
              max={365}
              className="w-full rounded border px-3 py-2"
              value={horizonDays}
              onChange={(e) => setHorizonDays(Math.max(7, Math.min(365, Number(e.target.value) || 0)))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy/80">Mindestnächte</label>
            <input
              type="number"
              min={1}
              max={30}
              className="w-full rounded border px-3 py-2"
              value={minNights}
              onChange={(e) => setMinNights(Math.max(1, Math.min(30, Number(e.target.value) || 0)))}
            />
          </div>
        </div>
      </div>

      <div className="text-sm text-navy/60">oder ICS‑Inhalt einfügen:</div>
      <textarea
        rows={6}
        className="w-full rounded border px-3 py-2"
        placeholder="BEGIN:VCALENDAR…"
        value={icsText}
        onChange={(e) => setIcsText(e.target.value)}
      />

      <button
        onClick={handleCheck}
        disabled={loading || (!icsUrl && !icsText)}
        className="rounded bg-north px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {loading ? 'Prüfe…' : 'Verfügbarkeit prüfen'}
      </button>

      {error && <p className="text-sm text-coral">{error}</p>}

      {result && (
        <div className="mt-3 text-sm">
          <p className="mb-1 text-navy/80">
            {result.countEvents} Events gefunden · Horizont: {result.horizonDays} Tage
          </p>
          <p className="mb-2">
            <span className="font-medium">Belegte Tage:</span>{' '}
            {result.bookedDays.length > 0 ? result.bookedDays.join(', ') : 'keine'}
          </p>

          <div className="mt-4">
            <div className="mb-1 font-medium">Freie Fenster (≥ {minNights} Nächte):</div>
            <ul className="list-disc pl-5">
              {filteredWindows.map((w, i) => (
                <li key={i}>
                  ab <strong>{w.start}</strong> für <strong>{w.length}</strong> Nächte
                </li>
              ))}
              {filteredWindows.length === 0 && (
                <li>keine freien Fenster im gewählten Horizont</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}


  return (
    <div className="mt-6 space-y-3 rounded-lg border p-4">
      <label className="block text-sm font-medium text-navy/80">
        Kalender‑URL (ICS)
      </label>
      <input
        className="w-full rounded border px-3 py-2"
        placeholder="https://…/calendar.ics"
        value={icsUrl}
        onChange={(e) => setIcsUrl(e.target.value)}
      />

      <div className="text-sm text-navy/60">oder ICS‑Inhalt einfügen:</div>
      <textarea
        rows={6}
        className="w-full rounded border px-3 py-2"
        placeholder="BEGIN:VCALENDAR…"
        value={icsText}
        onChange={(e) => setIcsText(e.target.value)}
      />

      <button
        onClick={handleCheck}
        disabled={loading || (!icsUrl && !icsText)}
        className="rounded bg-north px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {loading ? 'Prüfe…' : 'Verfügbarkeit prüfen'}
      </button>

      {error && <p className="text-sm text-coral">{error}</p>}

      {result && (
        <div className="mt-3 text-sm">
          <p className="mb-1 text-navy/80">
            {result.countEvents} Events gefunden · Horizont: {result.horizonDays} Tage
          </p>
          <p className="mb-2">
            <span className="font-medium">Belegte Tage:</span>{' '}
            {result.bookedDays.length > 0 ? result.bookedDays.join(', ') : 'keine'}
          </p>
          <div>
            <span className="font-medium">Freie Fenster:</span>
            <ul className="list-disc pl-5">
              {result.windows.map((w, i) => (
                <li key={i}>
                  ab <strong>{w.start}</strong> für <strong>{w.length}</strong> Nächte
                </li>
              ))}
              {result.windows.length === 0 && <li>keine freien Fenster im Horizont</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- Hauptseite --- */
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

  // Demo-Listings
  const listings: Listing[] = useMemo(
    () => [
      { id: 1, title: 'Nordseeperle', location: 'Wyk auf Föhr', price: 120, available: true,  image: 'https://picsum.photos/seed/foehr1/800/600' },
      { id: 2, title: 'Dünenblick',   location: 'Nieblum',      price: 95,  available: false, image: 'https://picsum.photos/seed/foehr2/800/600' },
      { id: 3, title: 'Inseltraum',   location: 'Utersum',      price: 150, available: true,  image: 'https://picsum.photos/seed/foehr3/800/600' },
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

  const setHash = (hash: '#gaeste' | '#vermieter') => {
    if (typeof window !== 'undefined') window.history.replaceState(null, '', hash);
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
            onClick={() => { setTab('guest'); setHash('#gaeste'); }}
          >
            Für Gäste
          </button>
          <button
            className={`px-3 py-2 rounded-lg border transition shadow-soft ${
              tab === 'host' ? 'bg-north text-white' : 'bg-cloud text-navy hover:bg-white'
            }`}
            onClick={() => { setTab('host'); setHash('#vermieter'); }}
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
                <article key={l.id} className="overflow-hidden rounded-xl border bg-white shadow-soft">
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
          <section id="vermieter" className="rounded-xl border bg-white p-6 shadow-soft">
            <h2 className="mb-2 text-xl font-semibold text-navy">Für Vermieter</h2>
            <p className="mb-4 text-navy/70">
              Trage hier demnächst deine Unterkunft ein und synchronisiere deinen Kalender (ICS).
            </p>
            <ul className="list-disc space-y-1 pl-5 text-navy/80">
              <li>Kalender‑URL (iCal/ICS) einfügen</li>
              <li>Automatische Erkennung freier Zeitfenster</li>
              <li>Direktlink zu deiner Buchungsseite</li>
            </ul>

            {/* ← Hier die ICS-Box einbinden */}
            <HostICSBox />
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
