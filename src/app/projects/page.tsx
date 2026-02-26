'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjects } from '@/hooks/useProjects';
import type { ProjectFilterStatus, ProjectStatus } from '@/types';
import SafeAreaContainer from '@/components/layout/SafeAreaContainer';
import ProjectCard from '@/components/projects/ProjectCard';
import EmptyState from '@/components/ui/EmptyState';

const statusFilters: { value: ProjectFilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: '시작 전', label: '시작 전' },
  { value: '진행 중', label: '진행 중' },
  { value: '완료', label: '완료' },
];

const statusDotColor: Record<ProjectStatus, string> = {
  '시작 전': 'bg-linen-300',
  '진행 중': 'bg-blue-400',
  '완료':   'bg-sage-500',
};

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, loading } = useProjects();
  const [filter, setFilter] = useState<ProjectFilterStatus>('all');

  const filtered = filter === 'all'
    ? projects
    : projects.filter((p) => p.status === filter);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 헤더 */}
      <div className="px-5 pt-6 pb-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-linen-900">Projects</h1>
        <button
          onClick={() => router.push('/projects/new')}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-linen-100 text-linen-600 active:bg-linen-200 transition-colors"
          aria-label="프로젝트 추가"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* 필터 pills */}
      <div className="px-5 flex gap-2 overflow-x-auto pb-3">
        {statusFilters.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`
                flex items-center gap-1.5 flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium min-h-[34px] transition-colors
                ${active
                  ? 'bg-linen-900 text-white'
                  : 'bg-linen-100 text-linen-600 active:bg-linen-200'
                }
              `}
            >
              {f.value !== 'all' && (
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? 'bg-white/60' : statusDotColor[f.value as ProjectStatus]}`} />
              )}
              {f.label}
            </button>
          );
        })}
      </div>

      <SafeAreaContainer className="bg-white">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-linen-400 text-sm">불러오는 중...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="프로젝트가 없어요"
            description="+ 버튼을 눌러 추가해보세요"
            actionLabel="추가하기"
            onAction={() => router.push('/projects/new')}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 px-5 pt-2 pb-4">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </SafeAreaContainer>
    </div>
  );
}
