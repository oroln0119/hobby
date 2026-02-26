'use client';

import { useState } from 'react';
import type { InventorySet } from '@/types';
import { CategoryBadge } from '@/components/ui/Badge';
import InventoryItemRow from './InventoryItemRow';
import Link from 'next/link';

interface InventorySetAccordionProps {
  set: InventorySet;
}

export default function InventorySetAccordion({ set }: InventorySetAccordionProps) {
  const [open, setOpen] = useState(false);
  const totalQuantity = set.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-linen-100 overflow-hidden">
      {/* 헤더 (접기/펴기) */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left active:bg-linen-50 transition-colors min-h-[64px] touch-manipulation"
        aria-expanded={open}
      >
        {/* 펼치기 아이콘 */}
        <span
          className={`flex-shrink-0 w-5 h-5 flex items-center justify-center text-linen-400 transition-transform duration-200 ${
            open ? 'rotate-90' : ''
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>

        {/* 메인 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <CategoryBadge category={set.category} />
            <span className="text-sm font-semibold text-linen-900 truncate">{set.brand}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-linen-600">
            <span>{set.material}</span>
            <span className="text-linen-300">·</span>
            <span className="font-medium text-oat-500">{set.size}</span>
            <span className="text-linen-300">·</span>
            <span>{set.needleLength}</span>
          </div>
          {set.notes && (
            <p className="text-xs text-linen-400 mt-0.5 truncate">{set.notes}</p>
          )}
        </div>

        {/* 수량 + 수정 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm font-semibold text-linen-700">{totalQuantity}개</span>
          <Link
            href={`/inventory/${set.id}/edit`}
            onClick={(e) => e.stopPropagation()}
            className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded-full text-linen-400 active:bg-linen-100 transition-colors"
            aria-label="수정"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
        </div>
      </button>

      {/* 아코디언 콘텐츠 */}
      <div className={`accordion-content ${open ? 'open' : ''}`}>
        <div className="accordion-inner">
          {set.items.map((item, index) => (
            <InventoryItemRow key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
