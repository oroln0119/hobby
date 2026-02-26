import type { CheckStatus } from '@/types';

interface StatusDotProps {
  status: CheckStatus;
  showLabel?: boolean;
}

export default function StatusDot({ status, showLabel = true }: StatusDotProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
          status === 'owned' ? 'bg-sage-600' : 'bg-yarn-red-500'
        }`}
      />
      {showLabel && (
        <span
          className={`text-xs font-medium ${
            status === 'owned' ? 'text-sage-600' : 'text-yarn-red-500'
          }`}
        >
          {status === 'owned' ? '보유 중' : '미보유'}
        </span>
      )}
    </span>
  );
}
