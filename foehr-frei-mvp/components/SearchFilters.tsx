// components/SearchFilters.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { Listing } from "@/lib/listings";

export type Filters = {
  q: string;          // Textsuche
  min: number | "";   // Preis min
  max: number | "";   // Preis max
  onlyFree: boolean;  // nur verfügbare
  location: string;   // Ort exakt/enthält
};

const LOCATIONS = ["Wyk", "Nieblum", "Utersum"];

export default function SearchFilters({
  data,
  onChange,
}: {
  data: Listing[];
  onChange: (filtered: Listing[], activeFilters: Filters) => void;
}) {
  const [q, setQ] = useState("");
  const [min, setMin] = useState<number | "">("");
  const [max, setMax] = useState<number | "">("");
  const [onlyFree, setOnlyFree] = useState(false);
  const [location, setLocation] = useState("");

  // Debounce: erst filtern, wenn Nutzer kurz aufgehört hat zu tippen
  useEffect(() => {
    const t = setTimeout(() => {
      const f: Filters = { q, min, max, onlyFree, location };
      const res = filterData(data, f);
      onChange(res, f);
    }, 200);
    return () => clearTimeout(t);
  }, [q, min, max, onlyFree, location, data, onChange]);

  return (
    <div className="grid gap-3 md:grid-cols-5">
      <input
        className="md:col-span-2 rounded-xl border px-3 py-2"
        placeholder="Suche Titel/Ort…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <input
        className="rounded-xl border px-3 py-2"
        type="number"
        min={0}
        placeholder="Preis min"
        value={min}
        onChange={(e) => setMin(e.target.value === "" ? "" : Number(e.target.value))}
      />
      <input
        className="rounded-xl border px-3 py-2"
        type="number"
        min={0}
        placeholder="Preis max"
        value={max}
        onChange={(e) => setMax(e.target.value === "" ? "" : Number(e.target.value))}
      />
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

      <label className="flex items-center gap-2 md:col-span-5">
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

function filterData(data: Listing[], f: Filters) {
  const q = f.q.trim().toLowerCase();
  return data.filter((it) => {
    if (q && !(`${it.title} ${it.location}`.toLowerCase().includes(q))) return false;
    if (f.location && it.location !== f.location) return false;
    if (f.onlyFree && !it.available) return false;
    if (typeof f.min === "number" && it.price < f.min) return false;
    if (typeof f.max === "number" && it.price > f.max) return false;
    return true;
  });
}
