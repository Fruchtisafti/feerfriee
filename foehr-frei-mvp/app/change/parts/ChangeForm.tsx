"use client";

import { z } from "zod";
import { useState } from "react";

const schema = z.object({
  date: z.string().min(1, "Datum erforderlich"),
  title: z.string().min(3, "Mind. 3 Zeichen"),
  description: z.string().optional(),
  area: z.enum([
    "Frontend",
    "Backend",
    "ICS",
    "Search",
    "Listings",
    "Infra",
    "Docs",
    "Other",
  ]),
  author: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ChangeForm() {
  const [form, setForm] = useState<FormData>({
    date: new Date().toISOString(),
    title: "",
    description: "",
    area: "Other",
    author: "Paul",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setMsg(parsed.error.issues[0]?.message ?? "Ungültige Eingabe");
      return;
    }

    setBusy(true);
    try {
      // TODO: echte Persistenz anbinden (API-Route oder Server Action)
      // Aktuell nur ein freundlicher Hinweis, damit Deploy nie bricht.
      await new Promise((r) => setTimeout(r, 400));
      setMsg(
        "Gespeichert (Demo). Bitte später echte Persistenz via API/DB anbinden."
      );
      setForm({
        date: new Date().toISOString(),
        title: "",
        description: "",
        area: "Other",
        author: "Paul",
      });
    } catch (err: any) {
      setMsg(err?.message ?? "Fehler beim Speichern");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-gray-200 p-4 shadow-sm"
    >
      <h3 className="text-base font-semibold">Neuen Eintrag hinzufügen</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Titel</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="Kurzbeschreibung"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Bereich</label>
          <select
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={form.area}
            onChange={(e) =>
              setForm({ ...form, area: e.target.value as FormData["area"] })
            }
          >
            {schema.shape.area._def.values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Autor</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="z. B. Paul"
            value={form.author ?? ""}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Beschreibung</label>
          <textarea
            className="mt-1 w-full rounded-xl border px-3 py-2"
            rows={3}
            placeholder="Details (optional)"
            value={form.description ?? ""}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl border bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {busy ? "Speichere…" : "Speichern"}
        </button>
        {msg ? <span className="text-sm text-gray-600">{msg}</span> : null}
      </div>
    </form>
  );
}
