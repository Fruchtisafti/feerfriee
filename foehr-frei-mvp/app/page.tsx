// app/page.tsx
'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import RoleTabs, { useActiveTab } from '@/components/RoleTabs';
import SearchFilters, { type Filters } from '@/components/SearchFilters';
import ListingCard from '@/components/ListingCard';
import HostICSBox from '@/components/HostICSBox';
import { LISTINGS, type Listing } from '@/lib/listings';

type Tab = 'gast' | 'vermieter';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-sm text-navy/70">Lade…</div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const tab = useActiveTab() as Tab;

  // Orte aus Daten ableiten
  const allLocations = useMemo(() => {
    const s = new Set<string>();
    LISTINGS.forEach((l) => l.location && s.add(l.location));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, []);

  // Filter-Status
  const [filters, setFilters] = useState<Filters>({
    q: '',
    min: '',
    max: '',
    onlyFree: true,
    location: '',
    sort: 'none',
  });

  // Filtern + Sortieren
  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const res = LISTINGS.filter((it) => {
      if (q && !(`${it.title} ${it.location}`.toLowerCase().includes(q))) return false;
      if (filters.location && it.location !== filters.location) return false;
      if (filters.onlyFree && !it.available) return false;
      if (filters.min !== '' && typeof filters.min === 'number' && it.price < filters.min) return false;
      if (filters.max !== '' && typeof filters.max === 'number' && it.price > filters.max) return false;
      return true;
    });

    switch (filters.sort) {
      case 'price-asc':
        res.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        res.sort((a, b) => b.price - a.price);
        break;
      case 'title-asc':
        res.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        res.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'none':
      default:
        break;
    }

    return res;
  }, [filters]);

  useEffect(() => {
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
  }, [tab]);

  return (
    <div className="space-y-6">
      <RoleTabs />

      {tab === 'gast' && (
        <>
          <SearchFilters value={filters} onChange={setFilters} locations={allLocations} />

          <section aria-label="Ergebnisse" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full rounded-2xl border p-6 text-sm text-navy/70 bg-white/70">
                Keine Treffer. Tipp: Filter lockern oder Suchbegriff ändern.
              </div>
            )}
          </section>
        </>
      )}

      {tab === 'vermieter' && (
        <>
          <section className="rounded-2xl border p-4 shadow-sm bg-white/80">
            <h2 className="text-base font-semibold mb-2">ICS‑Schnittstelle (Beta)</h2>
            <p className="text-sm text-navy/70 mb-3">
              Trage hier deinen Kalender (ICS) ein. Wir lesen nur Verfügbarkeiten aus.
            </p>
            <HostICSBox />
          </section>
        </>
      )}
    </div>
  );
}
