// components/NavBar.tsx
"use client";

import Link from "next/link";
import Logo from "./Logo";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-sm bg-white/70 border-b">
      <div className="container mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-6 w-auto" />
          <span className="sr-only">Föhr Frei</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/" className="text-sm text-navy/80 hover:text-navy">Suche</Link>
          <a
            href="mailto:hallo@deine-domain.tld"
            className="text-sm rounded-lg px-3 py-1.5 bg-north text-white hover:opacity-90 shadow-soft"
          >
            Vermieter werden
          </a>
        </nav>
      </div>
    </header>
  );
}
