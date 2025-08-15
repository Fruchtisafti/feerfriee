"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h2 className="text-xl font-semibold">Fehler</h2>
      <p className="mt-2 text-sm text-red-600">
        {error.message || "Unbekannter Fehler"}
      </p>
    </div>
  );
}
