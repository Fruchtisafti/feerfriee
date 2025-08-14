'use client';

import { useState } from 'react';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export default function HostLeadForm() {
  const [state, setState] = useState<State>({ status: 'idle' });
  const [form, setForm] = useState({
    name: '',
    email: '',
    objectName: '',
    calendarUrl: '',
    message: '',
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.objectName) {
      setState({ status: 'error', message: 'Bitte Name, E‑Mail und Objekt angeben.' });
      return;
    }
    try {
      setState({ status: 'loading' });
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `HTTP ${res.status}`);
      }
      setState({ status: 'success' });
      setForm({ name: '', email: '', objectName: '', calendarUrl: '', message: '' });
    } catch (err: any) {
      setState({ status: 'error', message: err?.message || 'Unbekannter Fehler' });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Name*</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">E‑Mail*</label>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Objekt / Unterkunftsname*</label>
        <input
          className="mt-1 w-full rounded-lg border px-3 py-2"
          value={form.objectName}
          onChange={(e) => setForm({ ...form, objectName: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Kalender‑URL (ICS, optional)</label>
        <input
          placeholder="https://…/calendar.ics"
          className="mt-1 w-full rounded-lg border px-3 py-2"
          value={form.calendarUrl}
          onChange={(e) => setForm({ ...form, calendarUrl: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Nachricht (optional)</label>
        <textarea
          rows={4}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={state.status === 'loading'}
          className="rounded bg-north px-4 py-2 text-white shadow-soft disabled:opacity-60"
        >
          {state.status === 'loading' ? 'Senden…' : 'Anfrage senden'}
        </button>
        {state.status === 'success' && (
          <span className="text-sm text-sea">Danke! Wir melden uns kurzfristig.</span>
        )}
        {state.status === 'error' && (
          <span className="text-sm text-coral">Fehler: {state.message}</span>
        )}
      </div>

      <p className="text-xs text-navy/60">
        Mit dem Absenden stimmst du der Verarbeitung deiner Angaben gemäß unserer{' '}
        <a className="underline" href="/datenschutz" target="_blank" rel="noreferrer">
          Datenschutzerklärung
        </a>{' '}
        zu.
      </p>
    </form>
  );
}
