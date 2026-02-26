import Button from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center gap-4">
      {icon ? (
        <div className="text-linen-300">{icon}</div>
      ) : (
        <div className="text-5xl">🧶</div>
      )}
      <div className="space-y-1">
        <p className="font-semibold text-linen-700">{title}</p>
        {description && <p className="text-sm text-linen-400">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
