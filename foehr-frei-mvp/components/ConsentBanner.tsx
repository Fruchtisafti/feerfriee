// components/ConsentBanner.tsx
'use client';

import { useEffect, useState } from 'react';

export default function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem('consent-v1');
      setShow(!v); // Banner zeigen, wenn noch keine Entscheidung vorliegt
    } catch {}
  }, []);

  function choose(value: 'accepted' | 'declined') {
    try {
      localStorage.setItem('consent-v1', value);
      setShow(false);
      // Optional: andere Komponenten können darauf reagieren
      window.dispatchEvent(new CustomEvent('consentchange', { detail: value }));
    } catch {}
  }

  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white/95 backdrop-blur border-t shadow-soft">
      <div className="container mx-auto max-w-6xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-sm text-navy/80">
          Wir nutzen notwendige Funktionen. Für Statistik/Werbung benötigen wir deine Einwilligung.
        </p>
        <div className="ml-auto flex gap-2">
          <button className="px-3 py-2 rounded border" onClick={() => choose('declined')}>
            Ablehnen
          </button>
          <button className="px-3 py-2 rounded bg-north text-white" onClick={() => choose('accepted')}>
            Einverstanden
          </button>
        </div>
      </div>
    </div>
  );
}
