import type { InventorySet, ToolReference, ToolCheckResult } from '@/types';

/** "8", "8mm", "8.0mm", "8.0" → "8" */
function normalizeSize(size: string): string {
  const cleaned = size.toLowerCase().trim().replace('mm', '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? cleaned : String(num);
}

/** "80 CM", "80cm", "80CM" → "80cm" */
function normalizeLength(length: string): string {
  return length.toLowerCase().replace(/\s+/g, '');
}

/**
 * 도안 권장 도구 목록을 인벤토리 세트와 대조해 보유 여부를 반환합니다.
 *
 * 매칭 기준:
 * - 카테고리: 정확 일치
 * - 사이즈: 정규화 후 일치 ("8mm" = "8" = "8.0mm")
 * - 바늘 길이: 도안에 명시된 경우만 체크, 생략 시 무관
 * - 브랜드/소재: 체크 안 함 (관대한 매칭)
 */
export function runInventoryCheck(
  patternTools: ToolReference[],
  inventorySets: InventorySet[]
): ToolCheckResult[] {
  return patternTools.map((tool) => {
    const normalizedSize = normalizeSize(tool.size);
    const normalizedLength = tool.needleLength ? normalizeLength(tool.needleLength) : null;

    const match = inventorySets.find((set) => {
      if (set.category !== tool.category) return false;
      if (normalizeSize(set.size) !== normalizedSize) return false;
      if (normalizedLength && normalizeLength(set.needleLength) !== normalizedLength) return false;
      const total = set.items.reduce((sum, item) => sum + item.quantity, 0);
      return total > 0;
    });

    if (match) {
      const matchedQty = match.items.reduce((sum, item) => sum + item.quantity, 0);
      return { tool, status: 'owned', matchedSetId: match.id, matchedQuantity: matchedQty };
    }
    return { tool, status: 'missing' };
  });
}
