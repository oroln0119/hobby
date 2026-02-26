import type { ProjectStatus } from '@/types';

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export function formatDateRange(startDate?: string, endDate?: string, status?: ProjectStatus): string {
  if (!startDate) return '';
  const start = formatDate(startDate);
  if (status === '완료' && endDate) {
    return `${start} ~ ${formatDate(endDate)}`;
  }
  if (status === '진행 중') {
    return `${start} ~ 진행 중`;
  }
  return start;
}

export function formatToolLabel(category: string, size: string, needleLength?: string): string {
  const parts = [size];
  if (needleLength) parts.push(needleLength);
  return `${category} · ${parts.join(' ')}`;
}
