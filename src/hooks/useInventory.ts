'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { InventorySet, InventoryItem, NeedleCategory, NeedleMaterial, ItemCondition } from '@/types';

export function useInventory() {
  const [inventorySets, setInventorySets] = useState<InventorySet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchInventory() {
      const { data: sets, error: setsError } = await supabase
        .from('inventory_sets')
        .select(`
          *,
          inventory_items (*)
        `)
        .order('brand');

      if (setsError) {
        console.error('인벤토리 fetch 오류:', setsError.message);
        setLoading(false);
        return;
      }

      const mapped: InventorySet[] = (sets ?? []).map((s) => ({
        id: s.id,
        category: s.category as NeedleCategory,
        brand: s.brand,
        material: s.material as NeedleMaterial,
        size: s.size,
        needleLength: s.needle_length,
        notes: s.notes ?? undefined,
        items: (s.inventory_items ?? []).map((item: any): InventoryItem => ({
          id: item.id,
          setId: item.set_id,
          quantity: item.quantity,
          condition: item.condition as ItemCondition,
          notes: item.notes ?? undefined,
        })),
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      }));

      setInventorySets(mapped);
      setLoading(false);
    }

    fetchInventory();
  }, []);

  return { inventorySets, loading };
}
