'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { BootSequence } from '@/components/ui/boot-sequence';
import { TourOverlay } from '@/components/onboarding/tour-overlay';
import { useState, useEffect } from 'react';
import { Radar } from 'lucide-react';
import { useAuth } from './auth-provider';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { PwaInstall } from '@/components/ui/pwa-install';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [booted, setBooted] = useState(false);
  const [bootReady, setBootReady] = useState(false);
  const [tourActive, setTourActive] = useState(false);

  useEffect(() => {
    const showBoot = sessionStorage.getItem('ecoos-booted');
    if (showBoot === 'true') {
      setBooted(true);
      setBootReady(true);
    } else {
      setBootReady(true);
    }
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== '/' && pathname !== '/login' && pathname !== '/signup') {
      const justLoggedIn = sessionStorage.getItem('ecoos-just-logged-in');
      if (justLoggedIn === 'true') {
        sessionStorage.removeItem('ecoos-just-logged-in');
        return;
      }
      router.push('/');
    }
  }, [loading, isAuthenticated, pathname, router]);

  // Show tour on first visit or when ?tour=true
  useEffect(() => {
    if (!booted) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('tour') === 'true') {
      setTourActive(true);
      return;
    }
    const seen = localStorage.getItem('ecoos-tour-seen');
    if (!seen) {
      setTourActive(true);
      localStorage.setItem('ecoos-tour-seen', 'true');
    }
  }, [booted]);

  const handleBootComplete = () => {
    sessionStorage.setItem('ecoos-booted', 'true');
    setBooted(true);
  };

  const handleTourComplete = () => {
    setTourActive(false);
  };

  const handleTourSkip = () => {
    setTourActive(false);
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
          <div className="mx-auto max-w-7xl animate-fade-in">
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
        </main>
        {/* Tour trigger button */}
        {!tourActive && (
          <button
            onClick={() => setTourActive(true)}
            className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 text-[10px]
              border border-emerald-700/40 bg-gray-950 text-emerald-500
              hover:border-emerald-500/60 hover:text-emerald-300 transition-all
              shadow-[0_0_10px_rgba(52,211,153,0.1)]"
          >
            <Radar className="h-3 w-3" />
            Take the Tour
          </button>
        )}
      </div>
      {tourActive && <TourOverlay onComplete={handleTourComplete} onSkip={handleTourSkip} />}
      <PwaInstall />
    </div>
  );
}
