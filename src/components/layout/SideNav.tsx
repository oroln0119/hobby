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
        className={`w-5 h-5 ${active ? 'text-oat-500' : 'text-linen-400'}`}
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
        className={`w-5 h-5 ${active ? 'text-oat-500' : 'text-linen-400'}`}
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

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border-r border-linen-100 h-screen sticky top-0">
      {/* 로고 */}
      <div className="px-6 py-6 border-b border-linen-100">
        <span className="text-xl font-bold text-linen-900">🧶 뜨개 노트</span>
      </div>

      {/* 네비게이션 */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-oat-50 text-oat-600'
                  : 'text-linen-500 hover:bg-linen-50 hover:text-linen-800'
              }`}
            >
              {tab.icon(active)}
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
