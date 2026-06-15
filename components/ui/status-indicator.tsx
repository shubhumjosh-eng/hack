import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'degraded' | 'loading';
  label?: string;
  className?: string;
}

const statusColors = {
  online: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]',
  offline: 'bg-red-400',
  degraded: 'bg-yellow-400',
  loading: 'bg-blue-400 animate-pulse',
};

const statusLabels = {
  online: 'Online',
  offline: 'Offline',
  degraded: 'Degraded',
  loading: 'Loading',
};

export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        className={cn(
          'inline-block h-2 w-2 rounded-full',
          statusColors[status]
        )}
      />
      <span className="text-xs text-emerald-400/60">{label || statusLabels[status]}</span>
    </div>
  );
}
