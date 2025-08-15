'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [message, setMessage] = useState('');

  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

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
        const msg = data?.error || `Fehler ${res.status}`;
        throw new Error(msg);
      }

      setNotice({ type: 'ok', text: 'Danke! Wir haben deine Nachricht erhalten.' });
      setName('');
      setEmail('');
      setCompany('');
      setWebsite('');
      setMessage('');
    } catch (err: any) {
      console.error('Kontaktformular Fehler:', err);
      const msg =
        err?.message ?? (typeof err === 'string' ? err : 'Unbekannter Fehler');
      setNotice({ type: 'error', text: `Senden fehlgeschlagen: ${msg}` });
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-navy/80">Name*</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy/80">E‑Mail*</label>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy/80">Firma</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy/80">Website</label>
          <input
            type="url"
            placeholder="https://…"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-navy/80">Nachricht*</label>
        <textarea
          rows={6}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="rounded bg-north px-4 py-2 font-medium text-white shadow-soft disabled:opacity-50"
      >
        {sending ? 'Senden…' : 'Senden'}
      </button>

      {notice && (
        <p
          className={`mt-2 text-sm ${
            notice.type === 'ok' ? 'text-sea' : 'text-coral'
          }`}
        >
          {notice.text}
        </p>
      )}
    </form>
  );
}
