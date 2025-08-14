// foehr-frei-mvp/app/layout.tsx
import './styles.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        {children}
      </body>
    </html>
  );
}
