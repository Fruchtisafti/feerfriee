// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Logo from '@/components/Logo';
import ConsentBanner from '@/components/ConsentBanner';
import Analytics from '@/components/Analytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Föhr Frei – Last‑Minute Unterkünfte',
  description: 'Hyperlokale Verfügbarkeits-Suche für Föhr (MVP).',
  openGraph: {
    title: 'Föhr Frei – Last‑Minute Unterkünfte',
    description: 'Hyperlokale Verfügbarkeits-Suche für Föhr (MVP).',
    url: 'https://feerfriee.vercel.app/',
    siteName: 'Föhr Frei',
  },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-cloud to-white text-navy`}>
        <header className="container mx-auto max-w-6xl px-4 py-6">
          <h1 className="mb-0"><Logo /></h1>
        </header>

        <main className="container mx-auto max-w-6xl px-4 py-6">
          {children}
        </main>

        <footer className="mt-12 text-xs text-navy/60 border-t">
          <div className="container mx-auto max-w-6xl px-4 py-6 flex flex-wrap gap-4">
            <span>© {new Date().getFullYear()} Föhr Frei · Prototyp (MVP)</span>
            <a className="underline" href="/impressum">Impressum</a>
            <a className="underline" href="/datenschutz">Datenschutz</a>
          </div>
        </footer>

        {/* Lädt nur Tracking, wenn im Component selbst Consent == 'granted' geprüft wird */}
        <Analytics />

        {/* Banner zeigt sich nur, wenn noch keine Entscheidung gespeichert ist */}
        <ConsentBanner />
      </body>
    </html>
  );
}
