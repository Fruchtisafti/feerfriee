// components/Logo.tsx
export default function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden="true">
        <path
          d="M1 12c3 0 3-4 6-4s3 4 6 4 3-4 6-4 3 4 6 4"
          stroke="#2563EB"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-semibold tracking-tight">Föhr Frei</span>
    </div>
  );
}

