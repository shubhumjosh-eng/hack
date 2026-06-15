import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  sublabel?: string;
  trend?: { value: number; positive: boolean };
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({ label, value, sublabel, trend, icon, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-emerald-800/30 bg-emerald-950/60 backdrop-blur-sm p-5',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-emerald-400/70 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold text-emerald-50 tabular-nums tracking-tight">{value}</p>
          {sublabel && (
            <p className="text-xs text-emerald-500/60">{sublabel}</p>
          )}
        </div>
        {icon && <div className="text-emerald-500/40">{icon}</div>}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center text-xs font-medium',
              trend.positive ? 'text-emerald-400' : 'text-red-400'
            )}
          >
            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-emerald-500/50">vs. prior period</span>
        </div>
      )}
    </div>
  );
}
