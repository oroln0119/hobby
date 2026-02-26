import Image from 'next/image';
import Link from 'next/link';
import type { Project, ProjectStatus } from '@/types';

interface ProjectCardProps {
  project: Project;
}

const statusDot: Record<ProjectStatus, string> = {
  '시작 전': 'bg-linen-300',
  '진행 중': 'bg-blue-400',
  '완료':   'bg-sage-500',
};

const statusLabel: Record<ProjectStatus, string> = {
  '시작 전': '시작 전',
  '진행 중': '진행 중',
  '완료':   '완료',
};

// 이미지 없을 때 카드 배경색
const cardBg: Record<string, string> = {
  '👕': 'bg-rose-wool-100',
  '👚': 'bg-rose-wool-100',
  '🧥': 'bg-oat-100',
  '👜': 'bg-oat-100',
  '🎒': 'bg-oat-100',
  '🌸': 'bg-rose-wool-100',
  '🧣': 'bg-linen-100',
  '🧶': 'bg-linen-100',
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const dot = statusDot[project.status];
  const bg = cardBg[project.emoji ?? ''] ?? 'bg-linen-100';

  return (
    <Link href={`/projects/${project.id}`} className="block active:opacity-80 transition-opacity">
      {/* 카드 */}
      <div className="rounded-2xl overflow-hidden bg-white border border-linen-100 shadow-sm">

        {/* 썸네일 영역 */}
        <div className={`relative aspect-square ${project.thumbnailUrl ? 'bg-linen-50' : bg}`}>
          {project.thumbnailUrl ? (
            <Image
              src={project.thumbnailUrl}
              alt={project.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 200px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl select-none">{project.emoji ?? '🧶'}</span>
            </div>
          )}

          {/* 상태 뱃지 */}
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/85 backdrop-blur-sm text-[11px] font-medium text-linen-700">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
            {statusLabel[project.status]}
          </span>
        </div>

        {/* 텍스트 */}
        <div className="px-3 py-2.5">
          <p className="text-[13px] font-semibold text-linen-900 leading-snug truncate">
            {project.name}
          </p>
          {project.brand && (
            <p className="text-[11px] text-linen-400 truncate mt-0.5">{project.brand}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
