'use client';

import { useEffect, useState } from 'react';

const CONSENT_KEY = 'ff_consent_v1';

type ConsentValue = 'granted' | 'denied' | null;

export default function ConsentBanner() {
  const [consent, setConsent] = useState<ConsentValue>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const v = localStorage.getItem(CONSENT_KEY) as ConsentValue;
      if (v === 'granted' || v === 'denied') setConsent(v);
    } catch {}
  }, []);

  function save(value: ConsentValue) {
    try {
      localStorage.setItem(CONSENT_KEY, value || 'denied');
      setConsent(value);
      // Damit der Analytics-Loader reagieren kann:
      window.dispatchEvent(new Event('ff-consent-changed'));
    } catch {}
  }

  if (!mounted || consent) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur px-4 py-3">
      <div className="mx-auto max-w-5xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-navy/80">
          Wir verwenden optionale, datenschutzfreundliche Analytics, um zu verstehen,
          wie die Seite genutzt wird. <a href="/datenschutz" className="underline">Mehr erfahren</a>.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => save('denied')}
            className="rounded border px-3 py-2 text-sm hover:bg-cloud"
          >
            Ablehnen
          </button>
          <button
            onClick={() => save('granted')}
            className="rounded bg-north px-3 py-2 text-sm text-white shadow-soft hover:opacity-90"
          >
            Zustimmen
          </button>
        </div>
      </div>
    </div>
  );
}

/** helper */
export function getConsent(): ConsentValue {
  try {
    const v = localStorage.getItem(CONSENT_KEY) as ConsentValue;
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}
