import Link from "next/link";

export default function NavBar() {
  return (
    <header className="border-b bg-white/70 backdrop-blur">
      <div className="container mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* kleines Inline-Logo, kannst du später ersetzen */}
          <span className="inline-block w-6 h-6 rounded bg-north" />
          <span className="font-semibold">Föhr Frei</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="#gast" className="hover:underline">Für Gäste</Link>
          <Link href="#vermieter" className="hover:underline">Für Vermieter</Link>
          <a
            href="https://github.com/Fruchtisafti/feerfriee"
            target="_blank"
            rel="noreferrer"
            className="text-navy/70 hover:text-navy"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
