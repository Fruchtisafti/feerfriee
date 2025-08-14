"use client";

import { useState } from "react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Beispiel-Daten – später durch echte API oder Datenbank ersetzen
    const data = ["Strand", "Fahrradverleih", "Café", "Museum", "Restaurant"];
    const filtered = data.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-sand p-4">
      <h1 className="text-3xl font-bold text-navy mb-6">Feerfriee Suche</h1>

      <form onSubmit={handleSearch} className="w-full max-w-md flex">
        <input
          type="text"
          placeholder="Suche nach Orten oder Services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
        />
        <button
          type="submit"
          className="bg-north text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
        >
          Suchen
        </button>
      </form>

      <ul className="mt-6 w-full max-w-md">
        {results.length > 0 ? (
          results.map((item, index) => (
            <li
              key={index}
              className="bg-white shadow-soft rounded-xl2 p-3 mb-2 text-navy"
            >
              {item}
            </li>
          ))
        ) : (
          <p className="text-gray-500 mt-4">Keine Ergebnisse</p>
        )}
      </ul>
    </main>
  );
}
