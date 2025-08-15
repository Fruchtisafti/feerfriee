'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // Honeypot (hidden)
  const [hp, setHp] = useState('');

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          company,
          website,
          email,
          message,
          honeypot: hp,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'Senden fehlgeschlagen');
      }
      setOk(true);
      setName('');
      setCompany('');
      setWebsite('');
      setEmail('');
      setMessage('');
      setHp('');
    } catch (err: any) {
      setOk(false);
      setError(err?.message || 'Fehler beim Senden');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label className="mb-1 block text-sm font-medium text-navy">Name*</label>
        <input
          className="w-full rounded-lg border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="sm:col-span-1">
        <label className="mb-1 block text-sm font-medium text-navy">E-Mail*</label>
        <input
          type="email"
          className="w-full rounded-lg border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="sm:col-span-1">
        <label className="mb-1 block text-sm font-medium text-navy">Firma</label>
        <input
          className="w-full rounded-lg border px-3 py-2"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="sm:col-span-1">
        <label className="mb-1 block text-sm font-medium text-navy">Website</label>
        <input
          type="url"
          className="w-full rounded-lg border px-3 py-2"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://…"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-navy">Nachricht*</label>
        <textarea
          className="w-full rounded-lg border px-3 py-2"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>

      {/* honeypot – versteckt für Menschen */}
      <div className="hidden">
        <label>Bitte leer lassen</label>
        <input value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>

      <div className="sm:col-span-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-north px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Senden…' : 'Senden'}
        </button>

        {ok && <span className="text-sm text-sea">Danke! Nachricht gesendet.</span>}
        {ok === false && <span className="text-sm text-coral">{error}</span>}
      </div>
    </form>
  );
}
