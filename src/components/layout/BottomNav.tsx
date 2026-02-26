'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  {
    id: 'projects',
    href: '/projects',
    label: '프로젝트',
    icon: (active: boolean) => (
      <svg
        className={`w-6 h-6 ${active ? 'text-oat-500' : 'text-linen-400'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    id: 'inventory',
    href: '/inventory',
    label: '인벤토리',
    icon: (active: boolean) => (
      <svg
        className={`w-6 h-6 ${active ? 'text-oat-500' : 'text-linen-400'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-linen-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex h-16">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors"
            >
              {tab.icon(active)}
              <span
                className={`text-[10px] font-medium leading-none ${
                  active ? 'text-oat-500' : 'text-linen-400'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
