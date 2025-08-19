// components/RoleTabs.tsx
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export type RoleTab = 'gast' | 'vermieter';

export function useActiveTab(): RoleTab {
  const sp = useSearchParams();
  const raw = sp.get('tab')?.toLowerCase();

  // Synonyme und Fallbacks:
  if (raw === 'vermieter' || raw === 'host') return 'vermieter';
  // "mieter" ist dasselbe wie "gast"
  return 'gast';
}

export default function RoleTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = useActiveTab();

  const makeHref = (tab: RoleTab) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('tab', tab);
    return `${pathname}?${sp.toString()}`;
  };

  const base =
    'px-4 py-2 rounded-xl border text-sm transition';
  const activeCls =
    'bg-north text-white shadow-soft border-north';
  const inactiveCls =
    'bg-white hover:bg-cloud/60 border-cloud text-navy';

  return (
    <div className="flex gap-2">
      <Link href={makeHref('gast')} className={`${base} ${active === 'gast' ? activeCls : inactiveCls}`}>
        Gäste (Mieter)
      </Link>
      <Link href={makeHref('vermieter')} className={`${base} ${active === 'vermieter' ? activeCls : inactiveCls}`}>
        Vermieter
      </Link>
    </div>
  );
}
