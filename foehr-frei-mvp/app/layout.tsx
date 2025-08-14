import './styles.css';

export const metadata = {
  title: "Föhr Frei – Last-Minute Unterkünfte",
  description: "Hyperlokale Verfügbarkeits-Suche für Föhr (MVP)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gradient-to-b from-cloud to-sand text-navy font-sans">
        <header className="bg-north text-white shadow-soft">
          <div className="container flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold">🌊 Föhr Frei</h1>
            <nav>
              <ul className="flex gap-4">
                <li><a href="#" className="hover:text-coral">Für Gäste</a></li>
                <li><a href="#" className="hover:text-coral">Für Vermieter</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="bg-navy text-white text-center py-4 mt-8">
          <p className="text-sm">Prototyp (MVP) – Keine Zahlungsabwicklung</p>
        </footer>
      </body>
    </html>
  );
}
