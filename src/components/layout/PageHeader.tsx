'use client';

import { useRouter } from 'next/navigation';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  backHref?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, showBack = false, backHref, action }: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-linen-100 flex items-center h-14 px-4 gap-2">
      {showBack && (
        <button
          onClick={handleBack}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 text-linen-700 rounded-full active:bg-linen-100 transition-colors"
          aria-label="뒤로가기"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      <h1 className="flex-1 text-lg font-semibold text-linen-900 truncate">{title ?? ''}</h1>
      {action && <div className="flex items-center">{action}</div>}
    </header>
  );
}
