import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-emerald-300/80"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-lg border bg-emerald-950/40 px-4 py-2.5 text-sm text-emerald-50 placeholder-emerald-600/50',
          'border-emerald-800/40 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20',
          'transition-all duration-200',
          error && 'border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-emerald-300/80"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'w-full rounded-lg border bg-emerald-950/40 px-4 py-2.5 text-sm text-emerald-50 placeholder-emerald-600/50',
          'border-emerald-800/40 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20',
          'transition-all duration-200 resize-vertical min-h-[100px]',
          error && 'border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-emerald-300/80"
        >
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          'w-full rounded-lg border bg-emerald-950/40 px-4 py-2.5 text-sm text-emerald-50',
          'border-emerald-800/40 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20',
          'transition-all duration-200',
          error && 'border-red-500/60',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-emerald-950 text-emerald-50">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
