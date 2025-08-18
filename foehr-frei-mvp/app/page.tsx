// app/page.tsx
"use client";

import { useMemo, useState } from "react";
import { LISTINGS, type Listing } from "@/lib/listings";
import ListingCard from "@/components/ListingCard";
import SearchFilters, { type Filters } from "@/components/SearchFilters";

export default function HomePage() {
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
      <h1 className="mb-6 text-3xl font-bold">Föhrfrei • Unterkünfte</h1>

      <div className="mb-4 rounded-2xl border p-4">
        <SearchFilters
          data={LISTINGS}
          onChange={(res, f) => {
            setFiltered(res);
            setActive(f);
          }}
        />
      </div>

      <div className="mb-4 text-sm text-gray-600">
        {filtered.length} Ergebnis{filtered.length === 1 ? "" : "se"} ·
        &nbsp;Filter: {active.q || "—"} · {active.location || "alle Orte"} ·{" "}
        {active.min !== "" ? `ab ${active.min}€` : "kein Min"} ·{" "}
        {active.max !== "" ? `bis ${active.max}€` : "kein Max"} ·{" "}
        {active.onlyFree ? "nur frei" : "alle"}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((it) => (
          <ListingCard key={it.id} item={it} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 rounded-xl border p-6 text-center">
          Keine Treffer. Passe deine Filter an.
        </div>
      )}
    </main>
  );
}
