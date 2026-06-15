'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Settings,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Radar,
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Triage', href: '/triage', icon: Search },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-emerald-800/25 bg-gray-950 transition-all duration-300',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      <div className="flex h-14 items-center border-b border-emerald-800/20 px-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-emerald-700/20 border border-emerald-600/30">
            <Radar className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className={cn('transition-opacity duration-300', collapsed && 'opacity-0 w-0')}>
            <p className="text-xs font-bold text-emerald-300 whitespace-nowrap tracking-tight">
              <span className="text-emerald-600">$</span> ecoos
            </p>
            <p className="text-[9px] text-emerald-700 whitespace-nowrap">v2.5.0 / food waste</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 text-xs font-mono transition-all duration-200 border-l-2',
                isActive
                  ? 'bg-emerald-700/10 text-emerald-300 border-l-emerald-500'
                  : 'text-emerald-600 hover:text-emerald-400 border-l-transparent hover:border-l-emerald-700/40'
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className={cn('transition-opacity duration-300', collapsed && 'opacity-0 w-0')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-emerald-800/20 p-3">
        <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600 shadow-[0_0_6px_rgba(52,211,153,0.3)]" />
          <div className={cn('transition-opacity duration-300', collapsed && 'opacity-0 w-0')}>
            <p className="text-[10px] text-emerald-700 font-mono">edge runtime</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-7 border-t border-emerald-800/20 text-emerald-700 hover:text-emerald-500 transition-colors"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
