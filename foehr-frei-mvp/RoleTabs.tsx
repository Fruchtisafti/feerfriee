// components/RoleTabs.tsx
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

const TABS = [
  { key: "mieter", label: "Mieter" },
  { key: "vermieter", label: "Vermieter" },
];

export default function RoleTabs() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const active = sp.get("tab") === "vermieter" ? "vermieter" : "mieter";

  function setTab(tab: string) {
    const p = new URLSearchParams(sp);
    p.set("tab", tab);
    router.push(`${pathname}?${p.toString()}`);
  }

  return (
    <div className="mb-4 flex gap-2">
      {TABS.map(t => (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={`rounded-xl border px-4 py-2 transition ${
            active === t.key ? "bg-black text-white" : "bg-white hover:bg-gray-50"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function useActiveTab() {
  const sp = useSearchParams();
  return sp.get("tab") === "vermieter" ? "vermieter" : "mieter";
}
