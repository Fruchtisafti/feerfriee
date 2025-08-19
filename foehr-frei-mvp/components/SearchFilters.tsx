// components/SearchFilters.tsx
"use client";

import { useMemo } from "react";

export type Filters = {
  q: string;                           // Textsuche (Titel/Ort)
  min: number | "";                    // Mindestpreis
  max: number | "";                    // Höchstpreis
  onlyFree: boolean;                   // nur verfügbare
  location: string;                    // Ort exakt, "" = alle
  sort: "none" | "price-asc" | "price-desc" | "title-asc" | "title-desc";
};

type Props = {
  value: Filters;
  onChange: (next: Filters) => void;
  // optional: Liste aller Orte zur Auswahl
  locations?: string[];
};

export default function SearchFilters({ value, onChange, locations }: Props) {
  // Falls keine locations übergeben: leere Liste
  const LOCATIONS = useMemo(() => locations ?? [], [locations]);

  return (
    <div className="grid gap-3 md:grid-cols-6">
      {/* Textsuche */}
      <input
        className="md:col-span-2 rounded-xl border px-3 py-2"
        placeholder="Suche Titel/Ort…"
        value={value.q}
        onChange={(e) => onChange({ ...value, q: e.target.value })}
      />

      {/* Preis min */}
      <input
        className="rounded-xl border px-3 py-2"
        type="number"
        min={0}
        placeholder="Preis min"
        value={value.min}
        onChange={(e) =>
          onChange({
            ...value,
            min: e.target.value === "" ? "" : Number(e.target.value),
          })
        }
      />

      {/* Preis max */}
      <input
        className="rounded-xl border px-3 py-2"
        type="number"
        min={0}
        placeholder="Preis max"
        value={value.max}
        onChange={(e) =>
          onChange({
            ...value,
            max: e.target.value === "" ? "" : Number(e.target.value),
          })
        }
      />

      {/* Ort */}
      <select
        className="rounded-xl border px-3 py-2"
        value={value.location}
        onChange={(e) => onChange({ ...value, location: e.target.value })}
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
        value={value.sort}
        onChange={(e) =>
          onChange({ ...value, sort: e.target.value as Filters["sort"] })
        }
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
          checked={value.onlyFree}
          onChange={(e) => onChange({ ...value, onlyFree: e.target.checked })}
        />
        <span>Nur verfügbare anzeigen</span>
      </label>
    </div>
  );
}
