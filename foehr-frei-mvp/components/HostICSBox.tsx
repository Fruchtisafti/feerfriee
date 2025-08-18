"use client";

import { useState } from "react";

export default function HostICSBox() {
  const [icsUrl, setIcsUrl] = useState("");

  return (
    <div className="rounded-2xl border p-4">
      <h3 className="mb-2 text-lg font-semibold">Vermieter: ICS / Deals</h3>
      <div className="mb-3 text-sm text-gray-600">
        Trage hier eine öffentliche ICS-URL ein (Kalender), wir zeigen die
        „Deals“ öffentlich an.
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl border px-3 py-2"
          placeholder="https://…/kalender.ics"
          value={icsUrl}
          onChange={(e) => setIcsUrl(e.target.value)}
        />
        <button
          className="rounded-xl border px-4 py-2 hover:bg-gray-50"
          onClick={() =>
            alert(`(Stub) Würde ICS laden: ${icsUrl || "(leer)"}`)
          }
        >
          Laden
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        TODO: Hier binden wir dann die geparsten Events aus{" "}
        <code>/api/ics/parse</code> ein.
      </div>
    </div>
  );
}
