'use client';

import { useMemo } from 'react';
import { runInventoryCheck } from '@/lib/utils/inventoryCheck';
import { useInventory } from './useInventory';
import type { ToolReference, ToolCheckResult } from '@/types';

export function useInventoryCheck(patternTools: ToolReference[]): {
  results: ToolCheckResult[];
  allOwned: boolean;
  missingCount: number;
  loading: boolean;
} {
  const { inventorySets, loading } = useInventory();

  const results = useMemo(() => {
    if (loading || patternTools.length === 0) return [];
    return runInventoryCheck(patternTools, inventorySets);
  }, [patternTools, inventorySets, loading]);

  const missingCount = results.filter((r) => r.status === 'missing').length;

  return {
    results,
    allOwned: missingCount === 0 && results.length > 0,
    missingCount,
    loading,
  };
}
