'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Project, ToolReference, Gauge, NeedleCategory, ProjectStatus, ProjectType } from '@/types';
import { useInventoryCheck } from '@/hooks/useInventoryCheck';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import StatusDot from '@/components/ui/StatusDot';

interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSubmit: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const statusOptions = [
  { value: '시작 전', label: '시작 전' },
  { value: '진행 중', label: '진행 중' },
  { value: '완료', label: '완료' },
];

const typeOptions = [
  { value: 'Pattern', label: 'Pattern (도안)' },
  { value: 'Kit', label: 'Kit (키트)' },
];

const categoryOptions: { value: NeedleCategory; label: string }[] = [
  { value: 'Knitting', label: 'Knitting' },
  { value: 'Crochet', label: 'Crochet' },
  { value: 'Cable', label: 'Cable' },
];

function ToolReferenceInput({
  tool,
  onChange,
  onRemove,
  showRemove,
}: {
  tool: ToolReference;
  onChange: (updated: ToolReference) => void;
  onRemove: () => void;
  showRemove: boolean;
}) {
  return (
    <div className="p-3 bg-linen-50 rounded-xl border border-linen-200 space-y-2">
      <div className="flex gap-2">
        <select
          value={tool.category}
          onChange={(e) => onChange({ ...tool, category: e.target.value as NeedleCategory })}
          className="flex-1 text-xs border border-linen-200 rounded-lg min-h-[36px] px-2 bg-white outline-none focus:border-oat-400"
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {showRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-yarn-red-500 active:opacity-70"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={tool.size}
          onChange={(e) => onChange({ ...tool, size: e.target.value })}
          placeholder="사이즈 (예: 5mm)"
          className="flex-1 text-xs border border-linen-200 rounded-lg min-h-[36px] px-2 bg-white outline-none focus:border-oat-400"
        />
        <input
          type="text"
          value={tool.needleLength ?? ''}
          onChange={(e) => onChange({ ...tool, needleLength: e.target.value || undefined })}
          placeholder="길이 (예: 40cm)"
          className="flex-1 text-xs border border-linen-200 rounded-lg min-h-[36px] px-2 bg-white outline-none focus:border-oat-400"
        />
      </div>
    </div>
  );
}

function PatternToolsSection({
  tools,
  onChange,
}: {
  tools: ToolReference[];
  onChange: (tools: ToolReference[]) => void;
}) {
  const { results, loading } = useInventoryCheck(tools);

  const addTool = () =>
    onChange([...tools, { category: 'Knitting', size: '' }]);
  const removeTool = (idx: number) =>
    onChange(tools.filter((_, i) => i !== idx));
  const updateTool = (idx: number, updated: ToolReference) =>
    onChange(tools.map((t, i) => (i === idx ? updated : t)));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-linen-700">
          권장 도구
          <span className="text-xs text-linen-400 ml-1 font-normal">(재고 자동 체크)</span>
        </p>
        <button
          type="button"
          onClick={addTool}
          className="text-xs text-oat-500 font-medium min-h-[32px] px-2 active:opacity-70"
        >
          + 추가
        </button>
      </div>
      <div className="space-y-2">
        {tools.map((tool, idx) => (
          <div key={idx} className="space-y-1">
            <ToolReferenceInput
              tool={tool}
              onChange={(updated) => updateTool(idx, updated)}
              onRemove={() => removeTool(idx)}
              showRemove={tools.length > 1}
            />
            {/* 실시간 재고 체크 결과 */}
            {!loading && tool.size && results[idx] && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
                results[idx].status === 'owned'
                  ? 'bg-sage-50 text-sage-600'
                  : 'bg-yarn-red-50 text-yarn-red-500'
              }`}>
                <StatusDot status={results[idx].status} showLabel={false} />
                {results[idx].status === 'owned'
                  ? `인벤토리에 보유 중 (${results[idx].matchedQuantity}개)`
                  : '인벤토리에 없는 도구예요'}
              </div>
            )}
          </div>
        ))}
        {tools.length === 0 && (
          <button
            type="button"
            onClick={addTool}
            className="w-full p-3 border-2 border-dashed border-linen-200 rounded-xl text-xs text-linen-400 active:border-oat-300 active:text-oat-400 transition-colors min-h-[44px]"
          >
            + 권장 도구 추가
          </button>
        )}
      </div>
    </div>
  );
}

function MyToolsSection({
  tools,
  onChange,
}: {
  tools: ToolReference[];
  onChange: (tools: ToolReference[]) => void;
}) {
  const addTool = () =>
    onChange([...tools, { category: 'Knitting', size: '' }]);
  const removeTool = (idx: number) =>
    onChange(tools.filter((_, i) => i !== idx));
  const updateTool = (idx: number, updated: ToolReference) =>
    onChange(tools.map((t, i) => (i === idx ? updated : t)));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-linen-700">실제 사용한 도구</p>
        <button
          type="button"
          onClick={addTool}
          className="text-xs text-oat-500 font-medium min-h-[32px] px-2 active:opacity-70"
        >
          + 추가
        </button>
      </div>
      <div className="space-y-2">
        {tools.map((tool, idx) => (
          <ToolReferenceInput
            key={idx}
            tool={tool}
            onChange={(updated) => updateTool(idx, updated)}
            onRemove={() => removeTool(idx)}
            showRemove={true}
          />
        ))}
        {tools.length === 0 && (
          <button
            type="button"
            onClick={addTool}
            className="w-full p-3 border-2 border-dashed border-linen-200 rounded-xl text-xs text-linen-400 active:border-oat-300 active:text-oat-400 transition-colors min-h-[44px]"
          >
            + 사용 도구 추가
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProjectForm({ initialData, onSubmit }: ProjectFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState(initialData?.name ?? '');
  const [status, setStatus] = useState<ProjectStatus>(initialData?.status ?? '시작 전');
  const [type, setType] = useState<ProjectType>(initialData?.type ?? 'Pattern');
  const [brand, setBrand] = useState(initialData?.brand ?? '');
  const [startDate, setStartDate] = useState(initialData?.startDate ?? '');
  const [endDate, setEndDate] = useState(initialData?.endDate ?? '');
  const [size, setSize] = useState(initialData?.size ?? '');
  const [yarn, setYarn] = useState(initialData?.yarn ?? '');
  const [notes, setNotes] = useState(initialData?.notes ?? '');
  const [url, setUrl] = useState(initialData?.url ?? '');

  const [patternGaugeStitches, setPatternGaugeStitches] = useState(
    initialData?.patternGauge?.stitches?.toString() ?? ''
  );
  const [patternGaugeRows, setPatternGaugeRows] = useState(
    initialData?.patternGauge?.rows?.toString() ?? ''
  );
  const [patternGaugeNeedle, setPatternGaugeNeedle] = useState(
    initialData?.patternGauge?.needleSize ?? ''
  );
  const [myGaugeStitches, setMyGaugeStitches] = useState(
    initialData?.myGauge?.stitches?.toString() ?? ''
  );
  const [myGaugeRows, setMyGaugeRows] = useState(
    initialData?.myGauge?.rows?.toString() ?? ''
  );
  const [myGaugeNeedle, setMyGaugeNeedle] = useState(
    initialData?.myGauge?.needleSize ?? ''
  );

  const [patternTools, setPatternTools] = useState<ToolReference[]>(
    initialData?.patternTools ?? []
  );
  const [myTools, setMyTools] = useState<ToolReference[]>(
    initialData?.myTools ?? []
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = '프로젝트명을 입력해주세요';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildGauge = (stitches: string, rows: string, needle: string): Gauge | undefined => {
    const s = parseInt(stitches);
    const r = parseInt(rows);
    if (!s || !r) return undefined;
    return { stitches: s, rows: r, needleSize: needle || undefined };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        status,
        type,
        brand: brand.trim() || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        size: size.trim() || undefined,
        yarn: yarn.trim() || undefined,
        notes: notes.trim() || undefined,
        url: url.trim() || undefined,
        patternGauge: buildGauge(patternGaugeStitches, patternGaugeRows, patternGaugeNeedle),
        myGauge: buildGauge(myGaugeStitches, myGaugeRows, myGaugeNeedle),
        patternTools: patternTools.filter((t) => t.size.trim()),
        myTools: myTools.filter((t) => t.size.trim()),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4 pb-8 overflow-x-hidden w-full">
      {/* 기본 정보 */}
      <section className="space-y-4">
        <Input
          label="프로젝트명 *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 줄무늬 비니, 케이블 스웨터"
          error={errors.name}
        />

        <div className="flex gap-3">
          <div className="flex-1 min-w-0">
            <Select
              label="상태 *"
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            />
          </div>
          <div className="flex-1 min-w-0">
            <Select
              label="타입 *"
              options={typeOptions}
              value={type}
              onChange={(e) => setType(e.target.value as ProjectType)}
            />
          </div>
        </div>

        <Input
          label="브랜드"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="예: Drops Design, We Are Knitters"
        />

        <Input
          label="도안/키트 URL"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://"
        />
      </section>

      {/* 날짜 & 사이즈 */}
      <section className="space-y-4">
        {/* 날짜: 세로 스택 (date input 최소 너비 문제 방지) */}
        <Input
          label="시작일 (Cast On)"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          label="종료일 (Finished Object)"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <Input
          label="사이즈"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="예: M, 총장 42.5cm"
        />
        <Input
          label="실 (Yarn)"
          value={yarn}
          onChange={(e) => setYarn(e.target.value)}
          placeholder="예: 낙양모사 에이캐시미어"
        />
      </section>

      {/* 게이지 */}
      <section>
        <h3 className="text-sm font-semibold text-linen-700 mb-3 flex items-center gap-1.5">
          <span>📏</span> 게이지
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {/* 권장 게이지 */}
          <div className="p-3 bg-linen-50 rounded-xl border border-linen-200 space-y-2">
            <p className="text-xs font-medium text-linen-400">권장 게이지</p>
            <input
              type="number"
              value={patternGaugeStitches}
              onChange={(e) => setPatternGaugeStitches(e.target.value)}
              placeholder="코/10cm"
              className="w-full text-sm border border-linen-200 rounded-lg min-h-[36px] px-2 bg-white outline-none focus:border-oat-400"
            />
            <input
              type="number"
              value={patternGaugeRows}
              onChange={(e) => setPatternGaugeRows(e.target.value)}
              placeholder="단/10cm"
              className="w-full text-sm border border-linen-200 rounded-lg min-h-[36px] px-2 bg-white outline-none focus:border-oat-400"
            />
            <input
              type="text"
              value={patternGaugeNeedle}
              onChange={(e) => setPatternGaugeNeedle(e.target.value)}
              placeholder="바늘 사이즈"
              className="w-full text-sm border border-linen-200 rounded-lg min-h-[36px] px-2 bg-white outline-none focus:border-oat-400"
            />
          </div>
          {/* 내 게이지 */}
          <div className="p-3 bg-linen-50 rounded-xl border border-linen-200 space-y-2">
            <p className="text-xs font-medium text-linen-400">내 게이지</p>
            <input
              type="number"
              value={myGaugeStitches}
              onChange={(e) => setMyGaugeStitches(e.target.value)}
              placeholder="코/10cm"
              className="w-full text-sm border border-linen-200 rounded-lg min-h-[36px] px-2 bg-white outline-none focus:border-oat-400"
            />
            <input
              type="number"
              value={myGaugeRows}
              onChange={(e) => setMyGaugeRows(e.target.value)}
              placeholder="단/10cm"
              className="w-full text-sm border border-linen-200 rounded-lg min-h-[36px] px-2 bg-white outline-none focus:border-oat-400"
            />
            <input
              type="text"
              value={myGaugeNeedle}
              onChange={(e) => setMyGaugeNeedle(e.target.value)}
              placeholder="바늘 사이즈"
              className="w-full text-sm border border-linen-200 rounded-lg min-h-[36px] px-2 bg-white outline-none focus:border-oat-400"
            />
          </div>
        </div>
      </section>

      {/* 도구 섹션 */}
      <section>
        <h3 className="text-sm font-semibold text-linen-700 mb-3 flex items-center gap-1.5">
          <span>🪡</span> 도구
        </h3>
        <div className="space-y-4">
          <PatternToolsSection tools={patternTools} onChange={setPatternTools} />
          <MyToolsSection tools={myTools} onChange={setMyTools} />
        </div>
      </section>

      {/* 메모 */}
      <Textarea
        label="메모"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="도안 관련 메모, 팁, 주의사항 등"
        rows={4}
      />

      {/* 저장 버튼 */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
          취소
        </Button>
        <Button type="submit" size="lg" disabled={submitting} className="flex-1">
          {submitting ? '저장 중...' : '저장하기'}
        </Button>
      </div>
    </form>
  );
}
