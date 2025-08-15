'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [message, setMessage] = useState('');

  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setNotice(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, website, message }),
      });

      const data = await res.json().catch(() => ({} as any));

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `Fehler ${res.status}`);
      }

      setNotice('Danke! Wir haben deine Nachricht erhalten.');
      setName(''); setEmail(''); setCompany(''); setWebsite(''); setMessage('');
    } catch (err: any) {
      setNotice(`Senden fehlgeschlagen: ${err?.message || 'Unbekannter Fehler'}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-navy/70">Name*</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Max Mustermann"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-navy/70">E‑Mail*</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="max@example.com"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-navy/70">Firma</span>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Firma"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-navy/70">Website</span>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="https://…"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block text-navy/70">Nachricht*</span>
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Kurz dein Anliegen…"
        />
      </label>

      <button
        type="submit"
        disabled={sending}
        className="rounded bg-north px-4 py-2 text-white disabled:opacity-50"
      >
        {sending ? 'Senden…' : 'Senden'}
      </button>

      {notice && <p className="text-sm">{notice}</p>}
    </form>
  );
}
