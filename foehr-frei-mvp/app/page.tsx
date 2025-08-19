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
    // Suspense nur als Schutz falls Unterkomponenten lazy laden
    <Suspense fallback={<div className="text-sm text-navy/70">Lade…</div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const tab = useActiveTab() as Tab; // kommt aus RoleTabs (gast | vermieter)

  // --- Filter-Status ---
  const [filters, setFilters] = useState<Filters>({
    query: '',
    onlyAvailable: true,
    maxPrice: undefined,
    location: 'alle',
  });

  // --- Gefilterte Listings ---
  const filtered = useMemo(() => {
    const q = filters.query?.trim().toLowerCase() ?? '';
    return LISTINGS.filter((l: Listing) => {
      if (filters.onlyAvailable && !l.available) return false;
      if (typeof filters.maxPrice === 'number' && l.price > filters.maxPrice) return false;
      if (filters.location && filters.location !== 'alle' && l.location.toLowerCase() !== filters.location.toLowerCase()) return false;
      if (q) {
        const hay =
          `${l.title} ${l.location} ${l.price} ${l.available ? 'frei' : 'belegt'}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [filters]);

  // Mini UX: Scroll nach oben, wenn Tab wechselt
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  }, [tab]);

  return (
    <div className="space-y-6">
      {/* Rollenwahl */}
      <RoleTabs />

      {tab === 'gast' && (
        <>
          {/* Suche/Filter */}
          <SearchFilters value={filters} onChange={setFilters} />

          {/* Ergebnisliste */}
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
          {/* Hinweisbox für Vermieter – NICHT fixed! */}
          <section className="rounded-2xl border p-4 shadow-sm bg-white/80">
            <h2 className="text-base font-semibold mb-2">ICS‑Schnittstelle (Beta)</h2>
            <p className="text-sm text-navy/70 mb-3">
              Trage hier deinen Kalender (ICS) ein. Wir lesen nur Verfügbarkeiten aus.
            </p>
            <HostICSBox />
          </section>

          {/* Optional: kleine öffentliche Übersicht der letzten ICS-Deals */}
          <section className="rounded-2xl border p-4 bg-white/70">
            <h3 className="text-sm font-medium mb-2">Kleine ICS‑Deals‑Liste (öffentlich)</h3>
            <p className="text-xs text-navy/60">
              (Platzhalter) Hier können später die letzten freien Zeiträume aus ICS‑Kalendern stehen.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
