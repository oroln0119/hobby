'use client';

import { useParams, useRouter } from 'next/navigation';
import { mockInventorySets } from '@/data/mock';
import type { InventorySet } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import SafeAreaContainer from '@/components/layout/SafeAreaContainer';
import InventoryForm from '@/components/inventory/InventoryForm';
import EmptyState from '@/components/ui/EmptyState';

export default function EditInventoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const setIndex = mockInventorySets.findIndex((s) => s.id === id);
  const inventorySet = mockInventorySets[setIndex];

  if (!inventorySet) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader title="수정" showBack />
        <EmptyState title="항목을 찾을 수 없어요" />
      </div>
    );
  }

  const handleSubmit = async (data: Omit<InventorySet, 'id' | 'createdAt' | 'updatedAt'>) => {
    mockInventorySets[setIndex] = {
      ...inventorySet,
      ...data,
      items: data.items.map((item, idx) => ({
        ...item,
        id: inventorySet.items[idx]?.id ?? `item-${Date.now()}-${idx}`,
        setId: inventorySet.id,
      })),
      updatedAt: new Date().toISOString(),
    };
    router.push('/inventory');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="용품 수정" showBack backHref="/inventory" />
      <SafeAreaContainer>
        <InventoryForm initialData={inventorySet} onSubmit={handleSubmit} />
      </SafeAreaContainer>
    </div>
  );
}
