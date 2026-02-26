'use client';

import { useRouter } from 'next/navigation';
import { mockInventorySets } from '@/data/mock';
import type { InventorySet } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import SafeAreaContainer from '@/components/layout/SafeAreaContainer';
import InventoryForm from '@/components/inventory/InventoryForm';

export default function NewInventoryPage() {
  const router = useRouter();

  const handleSubmit = async (data: Omit<InventorySet, 'id' | 'createdAt' | 'updatedAt'>) => {
    // 목 데이터에 추가 (추후 Supabase Server Action으로 교체)
    const newSet: InventorySet = {
      ...data,
      id: `inv-${Date.now()}`,
      items: data.items.map((item, idx) => ({
        ...item,
        id: `item-${Date.now()}-${idx}`,
        setId: `inv-${Date.now()}`,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockInventorySets.push(newSet);
    router.push('/inventory');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="용품 추가" showBack />
      <SafeAreaContainer>
        <InventoryForm onSubmit={handleSubmit} />
      </SafeAreaContainer>
    </div>
  );
}
