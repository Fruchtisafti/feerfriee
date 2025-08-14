// app/layout.tsx
import "./globals.css";
import NavBar from "@/components/NavBar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Föhr Frei – Last‑Minute Unterkünfte",
  description: "Hyperlokale Verfügbarkeits-Suche für Föhr (MVP).",
  openGraph: {
    title: "Föhr Frei – Last‑Minute Unterkünfte",
    description: "Hyperlokale Verfügbarkeits-Suche für Föhr (MVP).",
    url: "https://feerfriee.vercel.app/",
    siteName: "Föhr Frei",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-cloud to-white text-navy`}>
        <NavBar />
        <main className="container mx-auto max-w-5xl px-4 py-6">{children}</main>
        <footer className="mt-12 text-xs text-navy/60 border-t">
          <div className="container mx-auto max-w-5xl px-4 py-6">
            © {new Date().getFullYear()} Föhr Frei · Prototyp (MVP)
          </div>
        </footer>
      </body>
    </html>
  );
}
