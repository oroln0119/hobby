interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
}

export default function Card({ children, className = '', onClick, noPadding = false }: CardProps) {
  const base = `bg-white rounded-2xl shadow-sm border border-linen-100 ${noPadding ? '' : 'p-4'}`;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${base} w-full text-left active:scale-[0.99] transition-transform touch-manipulation ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={`${base} ${className}`}>
      {children}
    </div>
  );
}
