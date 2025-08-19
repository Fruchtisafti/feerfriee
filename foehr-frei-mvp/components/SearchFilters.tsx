// components/SearchFilters.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { Listing } from "@/lib/listings";

export type Filters = {
  q: string;                           // Textsuche (Titel/Ort)
  min: number | "";                    // Mindestpreis
  max: number | "";                    // Höchstpreis
  onlyFree: boolean;                   // nur verfügbare
  location: string;                    // Ort exakt
  sort?: "none" | "price-asc" | "price-desc" | "title-asc" | "title-desc";
};

type Props = {
  data: Listing[];
  onChange: (filtered: Listing[], activeFilters: Filters) => void;
  locations?: string[]; // optional: eigene Ortsliste übergeben
};

export default function SearchFilters({ data, onChange, locations }: Props) {
  // Orte automatisch aus den Daten ableiten, falls nicht übergeben
  const LOCATIONS = useMemo(() => {
    if (locations && locations.length) return locations;
    const set = new Set<string>();
    data.forEach((d) => d.location && set.add(d.location));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [data, locations]);

  // State
  const [q, setQ] = useState("");
  const [min, setMin] = useState<number | "">("");
  const [max, setMax] = useState<number | "">("");
  const [onlyFree, setOnlyFree] = useState(false);
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState<Filters["sort"]>("none");

  // Debounced Filter/Sort
  useEffect(() => {
    const t = setTimeout(() => {
      const f: Filters = { q, min, max, onlyFree, location, sort };
      const res = filterAndSort(data, f);
      onChange(res, f);
    }, 200);
    return () => clearTimeout(t);
  }, [q, min, max, onlyFree, location, sort, data, onChange]);

  return (
    <div className="grid gap-3 md:grid-cols-6">
      {/* Textsuche */}
      <input
        className="md:col-span-2 rounded-xl border px-3 py-2"
        placeholder="Suche Titel/Ort…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {/* Preis min */}
      <input
        className="rounded-xl border px-3 py-2"
        type="number"
        min={0}
        placeholder="Preis min"
        value={min}
        onChange={(e) => setMin(e.target.value === "" ? "" : Number(e.target.value))}
      />

      {/* Preis max */}
      <input
        className="rounded-xl border px-3 py-2"
        type="number"
        min={0}
        placeholder="Preis max"
        value={max}
        onChange={(e) => setMax(e.target.value === "" ? "" : Number(e.target.value))}
      />

      {/* Ort */}
      <select
        className="rounded-xl border px-3 py-2"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="">Alle Orte</option>
        {LOCATIONS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>

      {/* Sortierung */}
      <select
        className="rounded-xl border px-3 py-2"
        value={sort}
        onChange={(e) => setSort(e.target.value as Filters["sort"])}
      >
        <option value="none">Sortierung</option>
        <option value="price-asc">Preis ↑</option>
        <option value="price-desc">Preis ↓</option>
        <option value="title-asc">Name A–Z</option>
        <option value="title-desc">Name Z–A</option>
      </select>

      {/* Nur frei */}
      <label className="md:col-span-6 flex items-center gap-2">
        <input
          type="checkbox"
          checked={onlyFree}
          onChange={(e) => setOnlyFree(e.target.checked)}
        />
        <span>Nur verfügbare anzeigen</span>
      </label>
    </div>
  );
}

/** Hilfsfunktion: filtern + sortieren */
function filterAndSort(data: Listing[], f: Filters) {
  const q = f.q.trim().toLowerCase();

  const res = data.filter((it) => {
    if (q && !(`${it.title} ${it.location}`.toLowerCase().includes(q))) return false;
    if (f.location && it.location !== f.location) return false;
    if (f.onlyFree && !it.available) return false;
    if (typeof f.min === "number" && !Number.isNaN(f.min) && it.price < f.min) return false;
    if (typeof f.max === "number" && !Number.isNaN(f.max) && it.price > f.max) return false;
    return true;
  });

  switch (f.sort) {
    case "price-asc":
      res.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      res.sort((a, b) => b.price - a.price);
      break;
    case "title-asc":
      res.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "title-desc":
      res.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "none":
    default:
      // keine Sortierung
      break;
  }

  return res;
}
