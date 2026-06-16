'use client';

import { useState, useEffect, useMemo } from 'react';
import { Terminal, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { WASTE_CATEGORIES, computeWasteBreakdown, generateTrendData, type WasteStreamBreakdown, type WasteTrendPoint } from '@/lib/waste-streams';
import { useEventLog } from '@/hooks/use-event-log';
import { EventLog } from '@/components/ui/event-log';

export default function WasteStreamsPage() {
  const [totalKg, setTotalKg] = useState(120);
  const [days, setDays] = useState(30);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const breakdown = useMemo(() => computeWasteBreakdown(totalKg, days), [totalKg, days]);
  const trend = useMemo(() => generateTrendData(days), [days]);
  const { logs, addLog } = useEventLog();

  useEffect(() => {
    addLog('info', `Waste stream analysis loaded — ${totalKg}kg baseline`);
  }, []);

  const sorted = [...breakdown].sort((a, b) => b.amountKg - a.amountKg);
  const selected = breakdown.find(b => b.category === selectedCategory);
  const categoryInfo = WASTE_CATEGORIES.find(c => c.name === selectedCategory);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="terminal-panel">
        <div className="terminal-header flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-emerald-500" />
          <span>Waste Stream Analysis</span>
        </div>
        <div className="terminal-content space-y-5">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1">Baseline Waste</p>
              <input type="range" min={20} max={500} value={totalKg} onChange={e => setTotalKg(+e.target.value)} className="w-40 accent-emerald-600" />
              <span className="text-xs text-emerald-300 ml-2">{totalKg} kg/day</span>
            </div>
            <div>
              <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1">Trend Window</p>
              <select value={days} onChange={e => setDays(+e.target.value)} className="terminal-select text-[11px] w-24">
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map(b => {
              const cat = WASTE_CATEGORIES.find(c => c.name === b.category);
              const isSelected = selectedCategory === b.category;
              return (
                <button
                  key={b.category}
                  onClick={() => setSelectedCategory(isSelected ? null : b.category)}
                  className={`border text-left p-3 transition-all ${isSelected ? 'border-emerald-500/60 bg-emerald-900/15' : 'border-emerald-800/20 bg-gray-900/30 hover:border-emerald-700/40'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{cat?.icon ?? '🗑️'}</span>
                      <span className="text-xs text-emerald-300 font-mono">{b.category}</span>
                    </div>
                    <span className={`text-[10px] flex items-center gap-0.5 ${b.trend === 'up' ? 'text-red-400' : b.trend === 'down' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {b.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : b.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                      {b.trendPercent}%
                    </span>
                  </div>
                  <p className="text-lg font-bold text-emerald-200 tabular-nums">{b.amountKg.toFixed(1)} <span className="text-[10px] text-emerald-700 font-normal">kg</span></p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 flex-1 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${b.percentage}%`, backgroundColor: cat?.color ?? '#666' }} />
                    </div>
                    <span className="text-[10px] text-emerald-700">{b.percentage}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          {selected && categoryInfo && (
            <div className="border border-emerald-800/30 bg-gray-900/50 p-4 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="text-sm">{categoryInfo.icon}</span>
                <div>
                  <p className="text-sm text-emerald-300 font-mono">{selected.category}</p>
                  <p className="text-[10px] text-emerald-600">{categoryInfo.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="border border-emerald-800/20 p-2 text-center">
                  <p className="text-[9px] text-emerald-700 uppercase">Daily</p>
                  <p className="text-sm font-bold text-emerald-300">{selected.amountKg.toFixed(1)} kg</p>
                </div>
                <div className="border border-emerald-800/20 p-2 text-center">
                  <p className="text-[9px] text-emerald-700 uppercase">Annual</p>
                  <p className="text-sm font-bold text-emerald-300">{(selected.amountKg * 180).toFixed(0)} kg</p>
                </div>
                <div className="border border-emerald-800/20 p-2 text-center">
                  <p className="text-[9px] text-emerald-700 uppercase">Share</p>
                  <p className="text-sm font-bold text-emerald-300">{selected.percentage}%</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1.5">Recommended Interventions</p>
                <ul className="space-y-1">
                  {categoryInfo.interventions.map((int, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px] text-emerald-400/80">
                      <span className="text-emerald-600 shrink-0">{'>>'}</span>
                      <span>{int}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div>
            <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-2">Trend — Daily Waste (Last {days} Days)</p>
            <div className="border border-emerald-800/20 p-3 overflow-x-auto">
              <div className="flex items-end gap-0.5 h-32" style={{ minWidth: `${trend.length * 8}px` }}>
                {trend.map((t, i) => {
                  const maxVal = Math.max(...trend.map(x => x.total), 1);
                  const h = (t.total / maxVal) * 100;
                  return (
                    <div key={i} className="flex flex-col items-center" style={{ width: '6px' }}>
                      <div
                        className="w-full bg-emerald-600/60 hover:bg-emerald-500/80 transition-colors cursor-pointer"
                        style={{ height: `${h}%` }}
                        title={`${t.date}: ${t.total}kg`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 text-[10px] text-emerald-700">
            {WASTE_CATEGORIES.map(c => (
              <div key={c.id} className="flex items-center gap-1.5 border border-emerald-800/10 px-2 py-1">
                <span>{c.icon}</span>
                <span>{c.name}</span>
                <span className={`text-[8px] px-1 ${c.compostable ? 'text-emerald-500 bg-emerald-900/30' : 'text-red-500 bg-red-900/30'}`}>
                  {c.compostable ? 'compost' : 'landfill'}
                </span>
                {c.recyclable && <span className="text-[8px] text-blue-500 bg-blue-900/30 px-1">recycle</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <EventLog logs={logs} onClear={() => {}} />
    </div>
  );
}
