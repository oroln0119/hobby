import { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export default function Select({ label, options, error, placeholder, className = '', id, ...props }: SelectProps) {
  const selectId = id || label?.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="flex flex-col gap-1 min-w-0 w-full">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-linen-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`
            min-h-[44px] w-full pl-3 pr-10 rounded-xl border
            text-linen-900 text-sm appearance-none
            transition-colors outline-none bg-white
            ${error
              ? 'border-yarn-red-500 focus:border-yarn-red-500 focus:ring-2 focus:ring-yarn-red-100'
              : 'border-linen-200 focus:border-oat-400 focus:ring-2 focus:ring-oat-100'
            }
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg className="w-4 h-4 text-linen-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-yarn-red-500">{error}</p>}
    </div>
  );
}
