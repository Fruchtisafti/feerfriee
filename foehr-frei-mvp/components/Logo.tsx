// components/Logo.tsx
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="g2" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#2563EB"/>
            <stop offset="1" stopColor="#059669"/>
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="12" fill="url(#g2)"/>
        <path d="M10 40c8 0 8-8 16-8s8 8 16 8 8-8 16-8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="20" cy="22" r="4" fill="#fff"/>
      </svg>
      <span className="font-semibold tracking-tight">Föhr Frei</span>
    </div>
  );
}
