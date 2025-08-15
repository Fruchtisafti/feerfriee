'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle'|'sending'|'ok'|'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' }); // company = Honeypot

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Send failed');
      setStatus('ok');
      setForm({ name: '', email: '', message: '', company: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-xl">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            required
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">E‑Mail</label>
          <input
            type="email"
            required
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>

      <div className="hidden">
        {/* Honeypot-Feld gegen Bots */}
        <label>Firma</label>
        <input
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Nachricht</label>
        <textarea
          required
          rows={5}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          disabled={status === 'sending'}
          className="rounded-lg bg-north text-white px-4 py-2 disabled:opacity-60"
        >
          {status === 'sending' ? 'Senden…' : 'Abschicken'}
        </button>

        {status === 'ok' && (
          <span className="text-sm text-sea">Danke! Deine Nachricht wurde gesendet.</span>
        )}
        {status === 'error' && (
          <span className="text-sm text-coral">Ups – das hat nicht geklappt.</span>
        )}
      </div>
    </form>
  );
}
