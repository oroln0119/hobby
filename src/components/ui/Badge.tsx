import type { ProjectStatus, NeedleCategory, ProjectType } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'todo' | 'progress' | 'done' | 'kit' | 'pattern' | 'knitting' | 'crochet' | 'cable';
  className?: string;
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-linen-100 text-linen-600',
  todo: 'bg-[var(--color-status-todo)] text-[var(--color-status-todo-text)]',
  progress: 'bg-[var(--color-status-progress)] text-[var(--color-status-progress-text)]',
  done: 'bg-[var(--color-status-done)] text-[var(--color-status-done-text)]',
  kit: 'bg-rose-wool-100 text-rose-wool-500',
  pattern: 'bg-oat-100 text-oat-500',
  knitting: 'bg-oat-100 text-oat-500',
  crochet: 'bg-rose-wool-100 text-rose-wool-500',
  cable: 'bg-linen-100 text-linen-600',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const variantMap: Record<ProjectStatus, BadgeProps['variant']> = {
    '시작 전': 'todo',
    '진행 중': 'progress',
    '완료': 'done',
  };
  return <Badge variant={variantMap[status]}>{status}</Badge>;
}

export function ProjectTypeBadge({ type }: { type: ProjectType }) {
  return <Badge variant={type === 'Kit' ? 'kit' : 'pattern'}>{type}</Badge>;
}

export function CategoryBadge({ category }: { category: NeedleCategory }) {
  const variantMap: Record<NeedleCategory, BadgeProps['variant']> = {
    Knitting: 'knitting',
    Crochet: 'crochet',
    Cable: 'cable',
  };
  return <Badge variant={variantMap[category]}>{category}</Badge>;
}
