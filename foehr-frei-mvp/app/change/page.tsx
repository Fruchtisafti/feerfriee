// app/change/page.tsx
import { listChanges } from "@/lib/changelog";
import ChangeForm from "./parts/ChangeForm";

export const dynamic = "force-dynamic"; // immer frisch
export const metadata = {
  title: "Föhrfrei – Changelog",
  description: "Übersicht über Änderungen und Quick-Add für neue Einträge.",
};

export default async function ChangePage() {
  const items = await listChanges();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Changelog</h1>
      <p className="mt-2 text-sm text-gray-500">
        Kurz & verständlich. Änderungen am Projekt „Föhrfrei“.
      </p>

      <section className="mt-8">
        <ChangeForm />
      </section>

      <section className="mt-8 space-y-4">
        {items.length === 0 ? (
          <p className="text-gray-500">Noch keine Einträge.</p>
        ) : (
          items.map((c) => (
            <article
              key={c.id}
              className="rounded-2xl border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{c.title}</h2>
                <span className="text-xs rounded-full border px-2 py-0.5">
                  {c.area}
                </span>
              </div>
              {c.description ? (
                <p className="mt-2 text-sm text-gray-700">{c.description}</p>
              ) : null}
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                <time dateTime={c.date}>
                  {new Date(c.date).toLocaleString("de-DE")}
                </time>
                {c.author ? <span>· {c.author}</span> : null}
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
