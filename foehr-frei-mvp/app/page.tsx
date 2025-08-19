// app/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import RoleTabs, { useActiveTab } from "@/components/RoleTabs";
import { LISTINGS, type Listing } from "@/lib/listings";
import SearchFilters, { type Filters } from "@/components/SearchFilters";
import ListingCard from "@/components/ListingCard";
import HostICSBox from "@/components/HostICSBox";

/** Einfache Cookie-Banner Komponente (im selben File)
 *  - zeigt sich nur, wenn noch nicht akzeptiert
 *  - speichert Zustimmung in localStorage ("cookieConsent" = "accepted")
 */
function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const ok = typeof window !== "undefined" && localStorage.getItem("cookieConsent") === "accepted";
      setVisible(!ok);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 z-50 rounded-2xl border p-4 bg-white shadow-lg flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-700">
        Wir verwenden Cookies, um Funktionen bereitzustellen und die Nutzung zu analysieren.
        Mit Klick auf „Akzeptieren“ stimmst du dem zu.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => {
            try { localStorage.setItem("cookieConsent", "accepted"); } catch {}
            setVisible(false);
          }}
          className="rounded-xl px-4 py-2 bg-black text-white hover:bg-gray-800 border border-black/10"
        >
          Akzeptieren
        </button>
        {/* Optional: Link zur Datenschutzerklärung */}
        <a
          href="/datenschutz"
          className="rounded-xl px-4 py-2 border hover:bg-gray-50 text-sm"
        >
          Mehr erfahren
        </a>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Föhrfrei</h1>
      <p className="mb-6 text-gray-600">
        Finde freie Unterkünfte – oder veröffentliche deine Deals per ICS.
      </p>

      {/* Wichtig: alles was useSearchParams nutzt, in Suspense wrappen */}
      <Suspense fallback={<div className="mb-4 h-10 w-40 rounded-xl bg-gray-100" />}>
        <HomeInner />
      </Suspense>

      {/* Cookie-Banner ganz unten auf der Seite */}
      <CookieBanner />
    </main>
  );
}

function HomeInner() {
  const tab = useActiveTab();
  const [filtered, setFiltered] = useState<Listing[]>(LISTINGS);
  const [active, setActive] = useState<Filters>({
    q: "",
    min: "",
    max: "",
    onlyFree: false,
    location: "",
    sort: "none",
  });

  return (
    <>
      {/* Tabs: Mieter / Vermieter */}
      <RoleTabs />

      {tab === "mieter" && (
        <>
          {/* Filterbox – leichte UI-Politur */}
          <div className="mb-5 rounded-2xl border p-4 bg-white/60 backdrop-blur">
            <SearchFilters
              data={LISTINGS}
              onChange={(res, f) => {
                setFiltered(res);
                setActive(f);
              }}
            />
          </div>

          {/* Infozeile */}
          <div className="mb-4 text-sm text-gray-500 italic">
            {filtered.length} Ergebnis{filtered.length === 1 ? "" : "se"} ·{" "}
            Filter: {active.q || "—"} · {active.location || "alle Orte"} ·{" "}
            {active.min !== "" ? `ab ${active.min}€` : "kein Min"} ·{" "}
            {active.max !== "" ? `bis ${active.max}€` : "kein Max"} ·{" "}
            {active.onlyFree ? "nur frei" : "alle"} ·{" "}
            Sort: {active.sort && active.sort !== "none" ? active.sort : "—"}
          </div>

          {/* Karten */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it) => (
              <ListingCard key={it.id} item={it} />
            ))}
          </div>

          {/* Keine Treffer */}
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
          {/* Platz für weitere Vermieter-Features */}
        </div>
      )}
    </>
  );
}
