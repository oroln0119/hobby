import type { InventoryItem } from '@/types';

interface InventoryItemRowProps {
  item: InventoryItem;
  index: number;
}

const conditionColors = {
  Good: 'bg-sage-100 text-sage-600',
  Fair: 'bg-[var(--color-status-progress)] text-[var(--color-status-progress-text)]',
  Poor: 'bg-yarn-red-100 text-yarn-red-500',
} as const;

const conditionLabels = {
  Good: '좋음',
  Fair: '보통',
  Poor: '낡음',
} as const;

export default function InventoryItemRow({ item, index }: InventoryItemRowProps) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 border-t border-linen-100">
      <div className="w-6 h-6 rounded-full bg-linen-100 flex items-center justify-center flex-shrink-0">
        <span className="text-xs text-linen-600 font-medium">{index + 1}</span>
      </div>
      <div className="flex-1 flex items-center gap-2">
        <span className="text-sm text-linen-700">수량 {item.quantity}개</span>
        {item.notes && (
          <span className="text-xs text-linen-400 truncate">{item.notes}</span>
        )}
      </div>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${conditionColors[item.condition]}`}>
        {conditionLabels[item.condition]}
      </span>
    </div>
  );
}
