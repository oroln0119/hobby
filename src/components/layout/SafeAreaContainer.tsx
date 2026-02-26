interface SafeAreaContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function SafeAreaContainer({ children, className = '' }: SafeAreaContainerProps) {
  return (
    <main
      className={`flex-1 overflow-y-auto md:pb-4 ${className}`}
      style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom) + 0.5rem)' } as React.CSSProperties}
    >
      {children}
    </main>
  );
}
