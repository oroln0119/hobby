'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { runInventoryCheck } from '@/lib/utils/inventoryCheck';
import { formatDate } from '@/lib/utils/formatters';
import PageHeader from '@/components/layout/PageHeader';
import SafeAreaContainer from '@/components/layout/SafeAreaContainer';
import EmptyState from '@/components/ui/EmptyState';
import StatusDot from '@/components/ui/StatusDot';
import type { Project, InventorySet, ToolCheckResult } from '@/types';

// 프로퍼티 행 컴포넌트
function PropertyRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-linen-100 last:border-b-0">
      <div className="flex items-center gap-2 w-32 flex-shrink-0 pt-0.5">
        <span className="text-linen-300 text-base leading-none">{icon}</span>
        <span className="text-sm text-linen-400">{label}</span>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function EmptyValue() {
  return <span className="text-sm text-linen-300">비어 있음</span>;
}

// 상태 뱃지 (노션 스타일: 점 + 텍스트)
const statusDotColor = {
  '시작 전': 'bg-linen-300',
  '진행 중': 'bg-blue-400',
  '완료': 'bg-sage-600',
} as const;

function StatusPill({ status }: { status: '시작 전' | '진행 중' | '완료' }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-linen-100 text-sm text-linen-700">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDotColor[status]}`} />
      {status}
    </span>
  );
}

// Type 뱃지 (핑크 배경, 노션 Kit 스타일)
function TypePill({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-rose-wool-100 text-sm text-rose-wool-500 font-medium">
      {type}
    </span>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [inventorySets, setInventorySets] = useState<InventorySet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      const [{ data: proj }, { data: inv }] = await Promise.all([
        supabase.from('projects').select('*').eq('id', id).single(),
        supabase.from('inventory_sets').select('*, inventory_items(*)'),
      ]);

      if (proj) {
        setProject({
          id: proj.id,
          name: proj.name,
          emoji: proj.emoji ?? undefined,
          status: proj.status as Project['status'],
          type: proj.type as Project['type'],
          brand: proj.brand ?? undefined,
          startDate: proj.start_date ?? undefined,
          endDate: proj.end_date ?? undefined,
          size: proj.size ?? undefined,
          yarn: proj.yarn ?? undefined,
          thumbnailUrl: proj.thumbnail_url ?? undefined,
          notes: proj.notes ?? undefined,
          url: proj.url ?? undefined,
          patternGauge: proj.pattern_gauge ?? undefined,
          myGauge: proj.my_gauge ?? undefined,
          patternTools: proj.pattern_tools ?? [],
          myTools: proj.my_tools ?? [],
          createdAt: proj.created_at,
          updatedAt: proj.updated_at,
        });
      }

      if (inv) {
        setInventorySets(inv.map((s: any) => ({
          id: s.id,
          category: s.category,
          brand: s.brand,
          material: s.material,
          size: s.size,
          needleLength: s.needle_length,
          notes: s.notes ?? undefined,
          items: (s.inventory_items ?? []).map((item: any) => ({
            id: item.id,
            setId: item.set_id,
            quantity: item.quantity,
            condition: item.condition,
            notes: item.notes ?? undefined,
          })),
          createdAt: s.created_at,
          updatedAt: s.updated_at,
        })));
      }

      setLoading(false);
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader title="" showBack backHref="/projects" />
        <div className="flex justify-center items-center py-20 text-linen-400 text-sm">불러오는 중...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader title="프로젝트" showBack />
        <EmptyState title="프로젝트를 찾을 수 없어요" />
      </div>
    );
  }

  const checkResults: ToolCheckResult[] = project.patternTools.length > 0
    ? runInventoryCheck(project.patternTools, inventorySets)
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title=""
        showBack
        backHref="/projects"
        action={
          <button
            onClick={() => router.push(`/projects/${id}/edit`)}
            className="min-h-[44px] px-3 text-sm font-medium text-linen-500 active:text-linen-800 transition-colors"
          >
            수정
          </button>
        }
      />

      <SafeAreaContainer>
        <div className="px-5 pt-4 pb-8">
          {/* 이모지 + 제목 (노션 스타일) */}
          <div className="mb-6">
            <p className="text-5xl mb-3">{project.emoji ?? '🧶'}</p>
            <h1 className="text-2xl font-bold text-linen-900 leading-snug">{project.name}</h1>
          </div>

          {/* 프로퍼티 목록 */}
          <div className="divide-y divide-linen-100">
            {/* Progress */}
            <PropertyRow icon="✦" label="Progress">
              <StatusPill status={project.status} />
            </PropertyRow>

            {/* Type */}
            <PropertyRow icon="◎" label="Type">
              <TypePill type={project.type} />
            </PropertyRow>

            {/* Brand */}
            <PropertyRow icon="🍄" label="Brand">
              {project.brand
                ? <span className="text-sm text-linen-900">{project.brand}</span>
                : <EmptyValue />}
            </PropertyRow>

            {/* Cast On (시작일) */}
            <PropertyRow icon="📅" label="Cast On">
              {project.startDate
                ? <span className="text-sm text-linen-900">{formatDate(project.startDate)}</span>
                : <EmptyValue />}
            </PropertyRow>

            {/* Finished Object (종료일) */}
            <PropertyRow icon="📅" label="Finished Object">
              {project.endDate
                ? <span className="text-sm text-linen-900">{formatDate(project.endDate)}</span>
                : <EmptyValue />}
            </PropertyRow>

            {/* Gauge */}
            <PropertyRow icon="▪️" label="Gauge">
              {project.patternGauge ? (
                <span className="text-sm text-linen-900">
                  {project.patternGauge.stitches}코/{project.patternGauge.rows}단
                  {project.patternGauge.needleSize && ` (${project.patternGauge.needleSize})`}
                  {project.myGauge && (
                    <span className="text-linen-400 ml-1.5">
                      → 실제 {project.myGauge.stitches}코/{project.myGauge.rows}단
                    </span>
                  )}
                </span>
              ) : <EmptyValue />}
            </PropertyRow>

            {/* Needle */}
            <PropertyRow icon="↕" label="Needle">
              {project.patternTools.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  {project.patternTools.map((tool, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-sm text-linen-900">
                        {tool.category === 'Knitting' ? '대바늘' : tool.category === 'Crochet' ? '코바늘' : '케이블'}{' '}
                        {tool.size}
                        {tool.needleLength && `  ${tool.needleLength}`}
                      </span>
                      {checkResults[i] && (
                        <StatusDot status={checkResults[i].status} showLabel={false} />
                      )}
                    </div>
                  ))}
                </div>
              ) : <EmptyValue />}
            </PropertyRow>

            {/* Size */}
            <PropertyRow icon="👚" label="Size">
              {project.size
                ? <span className="text-sm text-linen-900">{project.size}</span>
                : <EmptyValue />}
            </PropertyRow>

            {/* Yarn */}
            <PropertyRow icon="🎞" label="Yarn">
              {project.yarn
                ? <span className="text-sm text-linen-900">{project.yarn}</span>
                : <EmptyValue />}
            </PropertyRow>

            {/* Notion (메모) */}
            <PropertyRow icon="◉" label="Notion">
              {project.notes
                ? <span className="text-sm text-linen-900 whitespace-pre-wrap">{project.notes}</span>
                : <EmptyValue />}
            </PropertyRow>

            {/* URL */}
            <PropertyRow icon="🔗" label="URL">
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 underline break-all"
                >
                  {project.url.replace(/^https?:\/\//, '')}
                </a>
              ) : <EmptyValue />}
            </PropertyRow>
          </div>

          {/* 재고 체크 요약 (도구 미보유 있을 때만) */}
          {checkResults.some((r) => r.status === 'missing') && (
            <div className="mt-6 p-3 bg-yarn-red-50 rounded-xl border border-yarn-red-100">
              <p className="text-sm text-yarn-red-500 font-medium mb-1">미보유 도구 있음</p>
              {checkResults
                .filter((r) => r.status === 'missing')
                .map((r, i) => (
                  <p key={i} className="text-xs text-yarn-red-500">
                    · {r.tool.category} {r.tool.size}{r.tool.needleLength ? ` ${r.tool.needleLength}` : ''}
                  </p>
                ))}
            </div>
          )}
        </div>
      </SafeAreaContainer>
    </div>
  );
}
