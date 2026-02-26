import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  const textareaId = id || label?.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-linen-700">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={3}
        className={`
          px-3 py-2.5 rounded-xl border
          text-linen-900 placeholder-linen-300 text-sm
          transition-colors outline-none resize-none
          ${error
            ? 'border-yarn-red-500 bg-yarn-red-50 focus:border-yarn-red-500'
            : 'border-linen-200 bg-white focus:border-oat-400 focus:ring-2 focus:ring-oat-100'
          }
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-yarn-red-500">{error}</p>}
    </div>
  );
}
