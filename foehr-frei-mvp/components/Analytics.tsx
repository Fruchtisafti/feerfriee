'use client';

import { useEffect, useState } from 'react';
import { getConsent } from './ConsentBanner';

export default function Analytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const apply = () => setEnabled(getConsent() === 'granted');
    apply();
    // reagiere auf Änderungen aus dem Banner
    const handler = () => apply();
    window.addEventListener('ff-consent-changed', handler);
    return () => window.removeEventListener('ff-consent-changed', handler);
  }, []);

  if (!enabled) return null;

  // Plausible (datenschutzfreundlich, keine Cookies, DSGVO‑freundlich)
  return (
    <>
      <script
        defer
        data-domain="feerfriee.vercel.app"
        src="https://plausible.io/js/script.js"
      />
    </>
  );
}
