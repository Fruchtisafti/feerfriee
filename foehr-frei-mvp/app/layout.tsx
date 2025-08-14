export const metadata = {
  title: "Föhr Frei – Last-Minute Unterkünfte",
  description: "Hyperlokale Verfügbarkeits-Suche für Föhr (MVP)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
