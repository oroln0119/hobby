'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInventory } from '@/hooks/useInventory';
import type { NeedleCategory, InventoryFilterCategory } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import SafeAreaContainer from '@/components/layout/SafeAreaContainer';
import InventorySetAccordion from '@/components/inventory/InventorySetAccordion';
import EmptyState from '@/components/ui/EmptyState';

const categoryFilters: { value: InventoryFilterCategory; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'Knitting', label: '대바늘' },
  { value: 'Crochet', label: '코바늘' },
  { value: 'Cable', label: '케이블' },
];

export default function InventoryPage() {
  const router = useRouter();
  const { inventorySets, loading } = useInventory();
  const [filter, setFilter] = useState<InventoryFilterCategory>('all');

  const filtered = filter === 'all'
    ? inventorySets
    : inventorySets.filter((s) => s.category === filter);

  const grouped = filtered.reduce<Record<NeedleCategory, typeof filtered>>((acc, set) => {
    if (!acc[set.category]) acc[set.category] = [];
    acc[set.category].push(set);
    return acc;
  }, {} as Record<NeedleCategory, typeof filtered>);

  const categoryOrder: NeedleCategory[] = ['Knitting', 'Crochet', 'Cable'];
  const categoryLabels: Record<NeedleCategory, string> = {
    Knitting: '대바늘 (Knitting)',
    Crochet: '코바늘 (Crochet)',
    Cable: '케이블 (Cable)',
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="인벤토리"
        action={
          <button
            onClick={() => router.push('/inventory/new')}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-oat-400 text-white active:bg-oat-500 transition-colors"
            aria-label="용품 추가"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        }
      />

      {/* 카테고리 필터 */}
      <div className="bg-white border-b border-linen-100 px-4 py-2.5 flex gap-2 overflow-x-auto">
        {categoryFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`
              flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[32px]
              ${filter === f.value
                ? 'bg-oat-400 text-white'
                : 'bg-linen-100 text-linen-600 active:bg-linen-200'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      <SafeAreaContainer>
        {loading ? (
          <div className="flex justify-center items-center py-20 text-linen-400 text-sm">불러오는 중...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="등록된 용품이 없어요"
            description="+ 버튼을 눌러 첫 번째 도구를 추가해보세요"
            actionLabel="용품 추가"
            onAction={() => router.push('/inventory/new')}
          />
        ) : (
          <div className="p-4 space-y-6">
            {categoryOrder.map((cat) => {
              const sets = grouped[cat];
              if (!sets || sets.length === 0) return null;
              return (
                <section key={cat}>
                  <h2 className="text-xs font-semibold text-linen-400 uppercase tracking-wider mb-2 px-1">
                    {categoryLabels[cat]}
                  </h2>
                  <div className="space-y-2">
                    {sets.map((set) => (
                      <InventorySetAccordion key={set.id} set={set} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </SafeAreaContainer>
    </div>
  );
}
