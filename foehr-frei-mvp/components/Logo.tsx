// components/Logo.tsx
type Props = { className?: string };

export default function Logo({ className = "" }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="ff-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill="url(#ff-grad)" />
        <path d="M10 30c4 3 8 3 12 0s8-3 12 0" stroke="#F8FAFC" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>

      <div className="leading-none">
        <div className="text-[18px] font-extrabold" style={{color:"#0F172A"}}>Föhr Frei</div>
        <div className="text-[12px] font-medium" style={{color:"#2563EB"}}>Last‑Minute Unterkünfte</div>
      </div>
    </div>
  );
}
