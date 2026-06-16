'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { cn } from '@/lib/utils';
import { BootSequence } from '@/components/ui/boot-sequence';
import { useState, useEffect } from 'react';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [booted, setBooted] = useState(false);
  const [bootReady, setBootReady] = useState(false);

  useEffect(() => {
    const showBoot = sessionStorage.getItem('ecoos-booted');
    if (showBoot === 'true') {
      setBooted(true);
      setBootReady(true);
    } else {
      setBootReady(true);
    }
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem('ecoos-booted', 'true');
    setBooted(true);
  };

  if (!bootReady) {
    return (
      <div className="flex h-screen bg-gray-950 items-center justify-center">
        <div className="text-emerald-500 animate-pulse">INITIALIZING...</div>
      </div>
    );
  }

  if (!booted) {
    return <BootSequence onComplete={handleBootComplete} />;
  }

  return (
    <div className="flex h-screen bg-gray-950 text-emerald-400 font-mono">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 scanlines">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
