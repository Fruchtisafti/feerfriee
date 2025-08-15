// lib/changelog.ts
export type ChangeItem = {
  id: string;
  date: string; // ISO
  title: string;
  description?: string;
  area:
    | "Frontend"
    | "Backend"
    | "ICS"
    | "Search"
    | "Listings"
    | "Infra"
    | "Docs"
    | "Other";
  author?: string;
};

export const changelog: ChangeItem[] = [
  {
    id: "2025-08-15-001",
    date: "2025-08-15T15:00:00.000Z",
    title: "Fix: Import-Pfad demoListings",
    description:
      "Tippfehler im Import behoben, Build schlägt nicht mehr fehl. Seite /listing/[id] lädt wieder.",
    area: "Frontend",
    author: "Paul",
  },
  {
    id: "2025-08-14-002",
    date: "2025-08-14T10:00:00.000Z",
    title: "Suche erweitert",
    description:
      "Frontend-Suche verbessert, Filter greifen schneller; kleinere UI‑Tweaks.",
    area: "Search",
    author: "GPT-5",
  },
];

/**
 * Placeholder für echtes Persistenz-Backend.
 * Aktuell nur in-memory, damit Deploy stabil bleibt.
 */
export async function listChanges(): Promise<ChangeItem[]> {
  // In echt: aus DB/API lesen.
  return changelog.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function addChange(_: Omit<ChangeItem, "id">): Promise<void> {
  // In echt: POST an /api/change oder DB call.
  // Hier absichtlich NO-OP, damit Deploy nie bricht.
  return;
}
