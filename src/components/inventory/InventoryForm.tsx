'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { InventorySet, InventoryItem, NeedleCategory, NeedleMaterial, ItemCondition } from '@/types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';

interface InventoryFormProps {
  initialData?: Partial<InventorySet>;
  onSubmit: (data: Omit<InventorySet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const categoryOptions = [
  { value: 'Knitting', label: 'Knitting (대바늘)' },
  { value: 'Crochet', label: 'Crochet (코바늘)' },
  { value: 'Cable', label: 'Cable (케이블 바늘)' },
];

const materialOptions = [
  { value: 'Bamboo', label: 'Bamboo (대나무)' },
  { value: 'Metal', label: 'Metal (금속)' },
  { value: 'Plastic', label: 'Plastic (플라스틱)' },
  { value: 'Wood', label: 'Wood (나무)' },
  { value: 'Carbon', label: 'Carbon (카본)' },
];

const conditionOptions = [
  { value: 'Good', label: '좋음' },
  { value: 'Fair', label: '보통' },
  { value: 'Poor', label: '낡음' },
];

export default function InventoryForm({ initialData, onSubmit }: InventoryFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [category, setCategory] = useState<NeedleCategory>(initialData?.category ?? 'Knitting');
  const [brand, setBrand] = useState(initialData?.brand ?? '');
  const [material, setMaterial] = useState<NeedleMaterial>(initialData?.material ?? 'Bamboo');
  const [size, setSize] = useState(initialData?.size ?? '');
  const [needleLength, setNeedleLength] = useState(initialData?.needleLength ?? '');
  const [notes, setNotes] = useState(initialData?.notes ?? '');
  const [items, setItems] = useState<Omit<InventoryItem, 'id' | 'setId'>[]>(
    initialData?.items?.map((i) => ({ quantity: i.quantity, condition: i.condition, notes: i.notes })) ?? [
      { quantity: 1, condition: 'Good' },
    ]
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!brand.trim()) newErrors.brand = '브랜드를 입력해주세요';
    if (!size.trim()) newErrors.size = '사이즈를 입력해주세요';
    if (!needleLength.trim()) newErrors.needleLength = '바늘 길이를 입력해주세요';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        category,
        brand: brand.trim(),
        material,
        size: size.trim(),
        needleLength: needleLength.trim(),
        notes: notes.trim() || undefined,
        items: items.map((item, idx) => ({
          id: `item-new-${idx}`,
          setId: '',
          quantity: item.quantity,
          condition: item.condition,
          notes: item.notes,
        })),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const addItem = () => setItems([...items, { quantity: 1, condition: 'Good' }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: string, value: string | number) => {
    setItems(items.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-4 pb-8">
      {/* 카테고리 */}
      <div>
        <p className="text-sm font-medium text-linen-700 mb-2">카테고리 *</p>
        <div className="flex gap-2">
          {categoryOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setCategory(opt.value as NeedleCategory)}
              className={`flex-1 min-h-[44px] rounded-xl text-sm font-medium transition-colors border ${
                category === opt.value
                  ? 'bg-oat-400 text-white border-oat-400'
                  : 'bg-white text-linen-700 border-linen-200 active:bg-linen-50'
              }`}
            >
              {opt.value}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="브랜드 *"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        placeholder="예: Clover, Addi, Tulip"
        error={errors.brand}
      />

      <Select
        label="소재"
        options={materialOptions}
        value={material}
        onChange={(e) => setMaterial(e.target.value as NeedleMaterial)}
      />

      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            label="사이즈 *"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="예: 5mm, 8"
            error={errors.size}
          />
        </div>
        <div className="flex-1">
          <Input
            label="바늘 길이 *"
            value={needleLength}
            onChange={(e) => setNeedleLength(e.target.value)}
            placeholder="예: 5in, 80cm"
            error={errors.needleLength}
          />
        </div>
      </div>

      <Textarea
        label="메모"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="추가 설명 (선택사항)"
        rows={2}
      />

      {/* 개별 품목 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-linen-700">개별 품목</p>
          <button
            type="button"
            onClick={addItem}
            className="text-xs text-oat-500 font-medium min-h-[32px] px-2 active:opacity-70"
          >
            + 품목 추가
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3 bg-linen-50 rounded-xl border border-linen-200">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-linen-500 flex-shrink-0">#{idx + 1}</span>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-14 text-center text-sm border border-linen-200 rounded-lg min-h-[36px] bg-white outline-none focus:border-oat-400"
                />
                <span className="text-xs text-linen-500">개</span>
                <select
                  value={item.condition}
                  onChange={(e) => updateItem(idx, 'condition', e.target.value)}
                  className="text-xs border border-linen-200 rounded-lg min-h-[36px] px-2 bg-white outline-none focus:border-oat-400"
                >
                  {conditionOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center text-yarn-red-500 active:opacity-70"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
          취소
        </Button>
        <Button type="submit" variant="primary" disabled={submitting} className="flex-1">
          {submitting ? '저장 중...' : '저장하기'}
        </Button>
      </div>
    </form>
  );
}
