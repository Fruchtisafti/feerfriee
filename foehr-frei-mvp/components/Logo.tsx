// components/Logo.tsx
type Props = { className?: string };

export default function Logo({ className }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      {/* Icon: Kreis (north) + Welle (sea) */}
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="#2563EB" /> {/* north */}
        <path d="M4 18c3 0 5-3 8-3s5 3 8 3 5-3 8-3v6H4z" fill="#059669" /> {/* sea */}
        <path d="M10 11h12v2H10z" fill="white" opacity=".9" /> {/* kleine Linie */}
      </svg>

      {/* Wortmarke */}
      <div className="leading-tight">
        <div className="text-navy font-bold">Föhr <span className="text-north">Frei</span></div>
        <div className="text-xs text-navy/60">Last‑Minute Unterkünfte</div>
      </div>
    </div>
  );
}
