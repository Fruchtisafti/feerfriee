// app/page.tsx
"use client";

import { useState } from "react";
import RoleTabs, { useActiveTab } from "@/components/RoleTabs";
import { LISTINGS, type Listing } from "@/lib/listings";
import SearchFilters, { type Filters } from "@/components/SearchFilters";
import ListingCard from "@/components/ListingCard";
import HostICSBox from "@/components/HostICSBox";

export default function HomePage() {
  const tab = useActiveTab();
  const [filtered, setFiltered] = useState<Listing[]>(LISTINGS);
  const [active, setActive] = useState<Filters>({
    q: "",
    min: "",
    max: "",
    onlyFree: false,
    location: "",
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Föhrfrei</h1>
      <p className="mb-6 text-gray-600">
        Finde freie Unterkünfte – oder veröffentliche deine Deals per ICS.
      </p>

      {/* Tabs zum Umschalten */}
      <RoleTabs />

      {tab === "mieter" && (
        <>
          {/* Filterbox */}
          <div className="mb-4 rounded-2xl border p-4">
            <SearchFilters
              data={LISTINGS}
              onChange={(res, f) => {
                setFiltered(res);
                setActive(f);
              }}
            />
          </div>

          {/* Infozeile zu Treffern */}
          <div className="mb-4 text-sm text-gray-600">
            {filtered.length} Ergebnis{filtered.length === 1 ? "" : "se"} ·
            &nbsp;Filter: {active.q || "—"} · {active.location || "alle Orte"} ·{" "}
            {active.min !== "" ? `ab ${active.min}€` : "kein Min"} ·{" "}
            {active.max !== "" ? `bis ${active.max}€` : "kein Max"} ·{" "}
            {active.onlyFree ? "nur frei" : "alle"}
          </div>

          {/* Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it) => (
              <ListingCard key={it.id} item={it} />
            ))}
          </div>

          {/* Keine Ergebnisse */}
          {filtered.length === 0 && (
            <div className="mt-8 rounded-xl border p-6 text-center">
              Keine Treffer. Passe deine Filter an.
            </div>
          )}
        </>
      )}

      {tab === "vermieter" && (
        <div className="grid gap-4">
          <HostICSBox />
          {/* Hier können weitere Vermieter-Features hin */}
        </div>
      )}
    </main>
  );
}
