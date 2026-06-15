'use client';

import { useEffect, useState } from 'react';
import { Terminal, Activity, Clock } from 'lucide-react';

export function Header() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex h-10 items-center justify-between border-b border-emerald-800/20 bg-gray-950/90 px-4">
      <div className="flex items-center gap-4 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-emerald-600">
          <Activity className="h-3 w-3" />
          <span>all systems nominal</span>
        </div>
        <span className="text-emerald-800">|</span>
        <div className="flex items-center gap-1.5 text-emerald-600">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
          <span>hf inference</span>
        </div>
        <span className="text-emerald-800">|</span>
        <div className="flex items-center gap-1.5 text-emerald-600">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
          <span>prediction engine</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-emerald-700">
          <Terminal className="h-3 w-3" />
          <span className="text-emerald-600">$</span>
          <span className="text-emerald-500/80">./ecoos</span>
        </div>
        <span className="text-emerald-800">|</span>
        <div className="flex items-center gap-1.5 text-emerald-700">
          <Clock className="h-3 w-3" />
          <span className="tabular-nums text-emerald-600">{currentTime || '--:--:--'}</span>
        </div>
      </div>
    </header>
  );
}
