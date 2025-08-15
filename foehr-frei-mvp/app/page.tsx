'use client';

import { useEffect, useMemo, useState } from 'react';
import ContactForm from '@/components/ContactForm';

/* ================== Types ================== */
type Listing = {
  id: number;
  title: string;
  location: string;
  price: number;
  available: boolean;
  persons: number;
  image: string;
  bookingUrl?: string;
};

/* ================== Utils ================== */
function fmtDE(isoOrYMD: string) {
  // iso "YYYY-MM-DD" oder ISO Datetime
  const d = new Date(isoOrYMD);
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short' }).format(d);
}
function todayAtMidnight() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function yyyymmdd(d: Date) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}
/** kleines Helferlein: erzeugt Demo‑ICS mit gebuchten Bereichen (halb‑offen [start,end)) */
function makeDemoICS(bookedRanges: [number, number][], horizonDays = 60) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//FoehrFrei Demo//DE'];
  const start0 = todayAtMidnight();
  for (const [a, b] of bookedRanges) {
    const start = addDays(start0, a);
    const end = addDays(start0, b);
    lines.push('BEGIN:VEVENT');
    lines.push(`DTSTART;VALUE=DATE:${yyyymmdd(start)}`);
    lines.push(`DTEND;VALUE=DATE:${yyyymmdd(end)}`);
    lines.push('SUMMARY:Gebucht');
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/* ================== Host: ICS-Checker Box ================== */
function HostICSBox() {
  const [icsUrl, setIcsUrl] = useState('');
  const [icsText, setIcsText] = useState('');
  const [horizonDays, setHorizonDays] = useState(30);
  const [minNights, setMinNights] = useState(3);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    ok: true;
    bookedDays: string[];
    windows: { start: string; length: number }[];
    horizonDays: number;
    countEvents: number;
  }>(null);
  const [error, setError] = useState<string | null>(null);

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
        body: JSON.stringify({ icsUrl: icsUrl || undefined, icsText: icsText || undefined, horizonDays }),
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

  const filteredWindows = result?.windows?.filter((w) => w.length >= minNights) ?? [];

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
                  ab <strong>{fmtDE(w.start)}</strong> für <strong>{w.length}</strong> Nächte
                </li>
              ))}
              {filteredWindows.length === 0 && <li>keine freien Fenster im gewählten Horizont</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================== Öffentliche Deals (Demo via ICS) ================== */
function DealsList() {
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState<
    {
      id: number;
      title: string;
      location: string;
      price: number;
      persons: number;
      image: string;
      bookingUrl: string;
      window: { start: string; length: number };
    }[]
  >([]);

  const demoSources = useMemo(
    () => [
      {
        id: 101,
        title: 'Strandnahes Apartment – Südstrand',
        location: 'Wyk auf Föhr',
        price: 109,
        persons: 3,
        image: 'https://picsum.photos/seed/deal1/800/600',
        bookingUrl: 'https://example.com/wyk-apartment',
        // Gebucht: [2,5), [10,12), [18,22) — Rest ist frei
        icsText: makeDemoICS([
          [2, 5],
          [10, 12],
          [18, 22],
        ]),
      },
      {
        id: 102,
        title: 'Reetdach-Häuschen – Ruhig & gemütlich',
        location: 'Nieblum',
        price: 139,
        persons: 4,
        image: 'https://picsum.photos/seed/deal2/800/600',
        bookingUrl: 'https://example.com/nieblum-haus',
        icsText: makeDemoICS([
          [1, 2],
          [6, 9],
          [15, 16],
          [25, 27],
        ]),
      },
      {
        id: 103,
        title: 'Friesenhaus unter Reet',
        location: 'Utersum',
        price: 159,
        persons: 5,
        image: 'https://picsum.photos/seed/deal3/800/600',
        bookingUrl: 'https://example.com/utersum-reet',
        icsText: makeDemoICS([
          [3, 6],
          [12, 14],
          [20, 24],
        ]),
      },
    ],
    []
  );

  useEffect(() => {
    (async () => {
      try {
        const results = await Promise.all(
          demoSources.map(async (src) => {
            const res = await fetch('/api/ics/parse', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ icsText: src.icsText, horizonDays: 60 }),
            });
            const data = await res.json();
            if (!res.ok || !data?.ok) throw new Error(data?.error || 'ICS Fehler');

            // Nimm das erste freie Fenster (≥ 3 Nächte)
            const win = (data.windows as { start: string; length: number }[]).find((w) => w.length >= 3);
            if (!win) return null;

            return {
              id: src.id,
              title: src.title,
              location: src.location,
              price: src.price,
              persons: src.persons,
              image: src.image,
              bookingUrl: src.bookingUrl,
              window: win,
            };
          })
        );

        const clean = results.filter(Boolean) as NonNullable<typeof results[number]>[];
        // Nach Startdatum sortieren
        clean.sort((a, b) => new Date(a.window.start).getTime() - new Date(b.window.start).getTime());
        setDeals(clean);
      } catch {
        setDeals([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [demoSources]);

  if (loading) {
    return <div className="rounded-xl border bg-white p-4 text-sm text-navy/70">Lade Deals…</div>;
  }
  if (deals.length === 0) {
    return <div className="rounded-xl border bg-white p-4 text-sm text-navy/70">Aktuell keine Deals gefunden.</div>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {deals.map((d) => (
        <article key={d.id} className="overflow-hidden rounded-xl border bg-white shadow-soft">
          <img src={d.image} alt={d.title} className="h-40 w-full object-cover" />
          <div className="flex flex-col gap-2 p-4">
            <h3 className="text-lg font-semibold text-navy">{d.title}</h3>
            <p className="text-sm text-navy/70">
              {d.location} · bis {d.persons} Pers. · ab {d.price} €
            </p>
            <div className="mt-1 rounded bg-sea/10 px-3 py-2 text-sm text-sea">
              <strong>Deal:</strong> ab {fmtDE(d.window.start)} für {d.window.length} Nächte
            </div>
            <div className="mt-auto flex justify-end">
              <a
                href={d.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded bg-north px-3 py-2 text-white"
              >
                Jetzt anfragen
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ================== Seite ================== */
export default function Page() {
  const [tab, setTab] = useState<'guest' | 'host'>('guest');

  // Filter-State
  const [search, setSearch] = useState('');
  const [onlyFree, setOnlyFree] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minPersons, setMinPersons] = useState<number | ''>('');
  const [location, setLocation] = useState<string>('Alle Orte');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'title_asc'>('price_asc');

  // Hash ↔ Tab (#gaeste / #vermieter)
  useEffect(() => {
    const applyHash = () => {
      const h = typeof window !== 'undefined' ? window.location.hash : '';
      if (h === '#vermieter') setTab('host');
      else setTab('guest');
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  // Demo-Listings (mit persons)
  const listings: Listing[] = useMemo(
    () => [
      { id: 1, title: 'Nordseeperle', location: 'Wyk auf Föhr', price: 120, available: true, persons: 3, image: 'https://picsum.photos/seed/foehr1/800/600' },
      { id: 2, title: 'Dünenblick', location: 'Nieblum', price: 95, available: false, persons: 2, image: 'https://picsum.photos/seed/foehr2/800/600' },
      { id: 3, title: 'Inseltraum', location: 'Utersum', price: 150, available: true, persons: 5, image: 'https://picsum.photos/seed/foehr3/800/600' },
    ],
    []
  );

  const locations = useMemo(() => {
    const set = new Set(listings.map((l) => l.location));
    return ['Alle Orte', ...Array.from(set)];
  }, [listings]);

  // Filter + Sort
  const filtered = useMemo(() => {
    let arr = listings.filter((l) => {
      if (onlyFree && !l.available) return false;
      if (maxPrice !== '' && l.price > maxPrice) return false;
      if (minPersons !== '' && l.persons < minPersons) return false;
      if (location !== 'Alle Orte' && l.location !== location) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!l.title.toLowerCase().includes(s) && !l.location.toLowerCase().includes(s)) return false;
      }
      return true;
    });

    arr = arr.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'title_asc':
          return a.title.localeCompare(b.title, 'de');
      }
    });

    return arr;
  }, [listings, onlyFree, maxPrice, minPersons, location, search, sortBy]);

  const activeFilters =
    (onlyFree ? 1 : 0) +
    (maxPrice !== '' ? 1 : 0) +
    (minPersons !== '' ? 1 : 0) +
    (location !== 'Alle Orte' ? 1 : 0) +
    (search ? 1 : 0);

  const resetFilters = () => {
    setSearch('');
    setOnlyFree(false);
    setMaxPrice('');
    setMinPersons('');
    setLocation('Alle Orte');
    setSortBy('price_asc');
  };

  const setHash = (hash: '#gaeste' | '#vermieter') => {
    if (typeof window !== 'undefined') window.history.replaceState(null, '', hash);
  };

  return (
    <main className="min-h-screen bg-cloud px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            className={`px-3 py-2 rounded-lg border transition shadow-soft ${tab === 'guest' ? 'bg-north text-white' : 'bg-cloud text-navy hover:bg-white'}`}
            onClick={() => { setTab('guest'); setHash('#gaeste'); }}
          >
            Für Gäste
          </button>
          <button
            className={`px-3 py-2 rounded-lg border transition shadow-soft ${tab === 'host' ? 'bg-north text-white' : 'bg-cloud text-navy hover:bg-white'}`}
            onClick={() => { setTab('host'); setHash('#vermieter'); }}
          >
            Für Vermieter
          </button>
        </div>

        {tab === 'guest' ? (
          <>
            {/* Deals */}
            <section className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-navy">Last‑Minute Deals (Demo)</h2>
                <span className="text-xs text-navy/60">live aus ICS‑Fenstern</span>
              </div>
              <DealsList />
            </section>

            {/* Filters */}
            <div className="mb-4 grid gap-3 md:grid-cols-12">
              <div className="md:col-span-3">
                <input
                  type="text"
                  placeholder="Suche (Ort/Name)"
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-north/40"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="md:col-span-3">
                <select className="w-full rounded-lg border px-3 py-2" value={location} onChange={(e) => setLocation(e.target.value)}>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <input
                  type="number"
                  min={1}
                  placeholder="Min. Personen"
                  className="w-full rounded-lg border px-3 py-2"
                  value={minPersons}
                  onChange={(e) => setMinPersons(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="number"
                  min={0}
                  placeholder="Max. Preis (€)"
                  className="w-full rounded-lg border px-3 py-2"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
              <div className="md:col-span-2">
                <select className="w-full rounded-lg border px-3 py-2" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                  <option value="price_asc">Preis ↑</option>
                  <option value="price_desc">Preis ↓</option>
                  <option value="title_asc">Name A–Z</option>
                </select>
              </div>
              <div className="md:col-span-12 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={onlyFree} onChange={(e) => setOnlyFree(e.target.checked)} />
                  Nur freie zeigen
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-navy/70">
                    {filtered.length} Treffer {activeFilters > 0 && <>(Filter aktiv: {activeFilters})</>}
                  </span>
                  <button onClick={resetFilters} className="rounded-lg border bg-white px-3 py-2 hover:bg-cloud">
                    Zurücksetzen
                  </button>
                </div>
              </div>
            </div>

            {/* Listings */}
            {filtered.length === 0 ? (
              <div className="rounded-xl border bg-white p-6 text-navy/70">Keine Ergebnisse. Passen Sie die Filter an.</div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((l) => (
                  <article key={l.id} className="overflow-hidden rounded-xl border bg-white shadow-soft">
                    <img src={l.image} alt={l.title} className="h-40 w-full object-cover" />
                    <div className="flex flex-col gap-2 p-4">
                      <h2 className="text-lg font-semibold text-navy">{l.title}</h2>
                      <p className="text-sm text-navy/70">
                        {l.location} · bis {l.persons} Pers.
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-bold text-north">{l.price} €</span>
                        <span className={`rounded px-2 py-1 text-xs font-medium ${l.available ? 'bg-sea/10 text-sea' : 'bg-coral/10 text-coral'}`}>
                          {l.available ? 'Frei' : 'Belegt'}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <section id="vermieter" className="rounded-xl border bg-white p-6 shadow-soft">
            <h2 className="mb-2 text-xl font-semibold text-navy">Für Vermieter</h2>
            <p className="mb-4 text-navy/70">Trage hier demnächst deine Unterkunft ein und synchronisiere deinen Kalender (ICS).</p>
            <ul className="list-disc space-y-1 pl-5 text-navy/80">
              <li>Kalender‑URL (iCal/ICS) einfügen</li>
              <li>Automatische Erkennung freier Zeitfenster</li>
              <li>Direktlink zu deiner Buchungsseite</li>
            </ul>

            {/* ICS-Checker */}
            <HostICSBox />
          </section>
        )}

        {/* Kontakt */}
        <section id="kontakt" className="mt-12 rounded-xl border bg-white p-6 shadow-soft">
          <h2 className="mb-2 text-xl font-semibold text-navy">Kontakt</h2>
          <p className="mb-4 text-navy/70">Fragen, Feedback oder Interesse als Vermieter? Schreib uns kurz:</p>
          <ContactForm />
        </section>
      </div>
    </main>
  );
}
