'use client';

import { LogEntry } from '@/hooks/use-event-log';
import { Terminal, X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface EventLogProps {
  logs: LogEntry[];
  onClear: () => void;
}

const TYPE_CONFIG = {
  info: { icon: Info, color: 'text-emerald-500', bg: 'border-l-emerald-700/40' },
  success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'border-l-emerald-500/40' },
  error: { icon: AlertCircle, color: 'text-red-400', bg: 'border-l-red-700/40' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'border-l-amber-700/40' },
};

export function EventLog({ logs, onClear }: EventLogProps) {
  const [collapsed, setCollapsed] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  return (
    <div className="terminal-panel">
      <div className="terminal-header flex items-center gap-2 cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
        <Terminal className="h-3 w-3 text-emerald-600" />
        <span className="text-emerald-600 text-[10px]">system_event_log</span>
        <span className="text-[10px] text-emerald-700 ml-1">[{logs.length}]</span>
        <button
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          className="ml-auto text-[10px] text-emerald-700 hover:text-emerald-500"
        >
          clear
        </button>
        <span className="text-emerald-700 ml-1">{collapsed ? '▼' : '▲'}</span>
      </div>
      {!collapsed && (
        <div className="max-h-[180px] overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-[10px] text-emerald-700">no events recorded</p>
            </div>
          ) : (
            <div className="space-y-0">
              {logs.map((entry) => {
                const cfg = TYPE_CONFIG[entry.type];
                const Icon = cfg.icon;
                const time = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                return (
                  <div key={entry.id} className={`flex items-start gap-2 px-3 py-1.5 border-l-2 ${cfg.bg} hover:bg-gray-900/50 text-[10px]`}>
                    <Icon className={`h-3 w-3 shrink-0 mt-0.5 ${cfg.color}`} />
                    <span className="text-emerald-700 shrink-0 tabular-nums">[{time}]</span>
                    <span className={`${cfg.color}`}>{entry.message}</span>
                    {entry.detail && <span className="text-emerald-600/50 ml-1 truncate">— {entry.detail}</span>}
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
