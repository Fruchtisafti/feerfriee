"use client";

import { useState } from "react";

export default function HomePage() {
  const [startdatum, setStartdatum] = useState("");
  const [naechte, setNaechte] = useState(3);
  const [personen, setPersonen] = useState(2);
  const [preis, setPreis] = useState(0);
  const [ort, setOrt] = useState("Alle Orte");

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-north">Unterkünfte suchen</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="date"
          value={startdatum}
          onChange={(e) => setStartdatum(e.target.value)}
          className="border rounded-xl p-2 w-full"
        />
        <input
          type="number"
          value={naechte}
          onChange={(e) => setNaechte(parseInt(e.target.value))}
          className="border rounded-xl p-2 w-full"
          placeholder="Nächte"
        />
        <input
          type="number"
          value={personen}
          onChange={(e) => setPersonen(parseInt(e.target.value))}
          className="border rounded-xl p-2 w-full"
          placeholder="Personen"
        />
        <input
          type="number"
          value={preis}
          onChange={(e) => setPreis(parseInt(e.target.value))}
          className="border rounded-xl p-2 w-full"
          placeholder="Preis bis (0 = egal)"
        />
        <select
          value={ort}
          onChange={(e) => setOrt(e.target.value)}
          className="border rounded-xl p-2 w-full"
        >
          <option>Alle Orte</option>
          <option>Wyk</option>
          <option>Nieblum</option>
        </select>
      </div>

      <button className="bg-sea hover:bg-coral text-white font-bold py-2 px-6 rounded-xl shadow-soft transition">
        Demo laden
      </button>

      <div className="mt-6 text-lg font-semibold text-navy">
        0 Unterkünfte gefunden
      </div>
    </div>
  );
}
