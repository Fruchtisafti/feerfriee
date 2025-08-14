"use client";

import { useState } from "react";

export default function Home() {
  const [tab, setTab] = useState<"guest" | "host">("guest");
  const [search, setSearch] = useState("");

  const listings = [
    {
      id: 1,
      title: "Nordseeperle",
      location: "Wyk auf Föhr",
      price: 120,
      available: true,
      image: "https://source.unsplash.com/400x300/?beach,house",
    },
    {
      id: 2,
      title: "Dünenblick",
      location: "Nieblum",
      price: 95,
      available: false,
      image: "https://source.unsplash.com/400x300/?coast,home",
    },
    {
      id: 3,
      title: "Inseltraum",
      location: "Utersum",
      price: 150,
      available: true,
      image: "https://source.unsplash.com/400x300/?sea,house",
    },
  ];

  const filteredListings = listings.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase())
  );

  const resetSearch = () => setSearch("");

  return (
    <main className="min-h-screen bg-cloud px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-navy mb-8">Föhr Frei</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            className={`px-3 py-2 rounded border transition ${
              tab === "guest"
                ? "bg-north text-white shadow-soft"
                : "bg-cloud text-navy hover:bg-white"
            }`}
            onClick={() => setTab("guest")}
          >
            Für Gäste
          </button>
          <button
            className={`px-3 py-2 rounded border transition ${
              tab === "host"
                ? "bg-north text-white shadow-soft"
                : "bg-cloud text-navy hover:bg-white"
            }`}
            onClick={() => setTab("host")}
          >
            Für Vermieter
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Suche nach Ort oder Name"
            className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-north/40"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={resetSearch}
            className="rounded-lg px-3 py-2 bg-cloud hover:bg-white border"
          >
            Reset
          </button>
        </div>

        {/* Listings */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((l) => (
            <div
              key={l.id}
              className="border rounded-xl shadow-soft bg-white overflow-hidden"
            >
              <img
                src={l.image}
                alt={l.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-navy">{l.title}</h2>
                <p className="text-sm text-navy/70">{l.location}</p>

                <div className="mt-auto flex justify-between items-center">
                  <span className="font-bold text-north">{l.price} €</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      l.available
                        ? "bg-sea/10 text-sea"
                        : "bg-coral/10 text-coral"
                    }`}
                  >
                    {l.available ? "Frei" : "Belegt"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
// ... oberer Teil deiner Datei bleibt gleich

export default function Page() {
  const [tab, setTab] = useState<'guest' | 'host'>('guest');
  const [listings, setListings] = useState<Listing[]>([]);

  // Beim Laden Hash auswerten und auf Änderungen reagieren
  useEffect(() => {
    const applyHash = () => {
      const h = typeof window !== 'undefined' ? window.location.hash : '';
      if (h === '#vermieter') setTab('host');
      else if (h === '#gaeste') setTab('guest');
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  // ... dein localStorage-Laden + -Speichern bleibt wie gehabt

  return (
    <div className="container mx-auto max-w-5xl px-4">
      <header className="mb-6 flex items-center justify-between">
        <Logo className="text-2xl md:text-3xl" />
        <button
          onClick={() => loadDemo(setListings)}
          className="text-sm px-3 py-2 rounded border hover:bg-slate-50"
        >
          Demo laden
        </button>
      </header>

      {/* TAB-BUTTONS */}
      <div className="mb-4 flex gap-2">
        <button
          className={`px-3 py-2 rounded border ${
            tab === 'guest' ? 'bg-slate-900 text-white' : 'bg-white'
          }`}
          onClick={() => {
            setTab('guest');
            if (typeof window !== 'undefined') {
              window.history.replaceState(null, '', '#gaeste');
            }
          }}
        >
          Für Gäste
        </button>
        <button
          className={`px-3 py-2 rounded border ${
            tab === 'host' ? 'bg-slate-900 text-white' : 'bg-white'
          }`}
          onClick={() => {
            setTab('host');
            if (typeof window !== 'undefined') {
              window.history.replaceState(null, '', '#vermieter');
            }
          }}
        >
          Für Vermieter
        </button>
      </div>

      {tab === 'guest' ? (
        <GuestSearch
          listings={listings}
          onLoadDemo={() => loadDemo(setListings)}
        />
      ) : (
        // id, damit /#vermieter auch scrollt (falls gebraucht)
        <div id="vermieter">
          <HostOnboarding
            listings={listings}
            addListing={(l) => setListings((prev) => [...prev, l])}
            setListings={setListings}
          />
        </div>
      )}

      <footer className="mt-12 text-xs text-slate-500">
        <p>
          Prototyp (MVP). Keine Zahlungsabwicklung. Angezeigte Verfügbarkeiten
          basieren auf Kalenderdaten der Vermieter.
        </p>
      </footer>
    </div>
  );
}
