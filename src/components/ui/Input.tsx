import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({ label, error, hint, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-linen-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full min-w-0 min-h-[44px] px-3 rounded-xl border
          text-linen-900 placeholder-linen-300 text-sm
          transition-colors outline-none
          ${error
            ? 'border-yarn-red-500 bg-yarn-red-50 focus:border-yarn-red-500 focus:ring-2 focus:ring-yarn-red-100'
            : 'border-linen-200 bg-white focus:border-oat-400 focus:ring-2 focus:ring-oat-100'
          }
          ${className}
        `}
        {...props}
      />
      {hint && !error && <p className="text-xs text-linen-400">{hint}</p>}
      {error && <p className="text-xs text-yarn-red-500">{error}</p>}
    </div>
  );
}
