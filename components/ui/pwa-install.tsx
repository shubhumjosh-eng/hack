'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export function PwaInstall() {
  const [deferred, setDeferred] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstall() {
    if (!deferred) return;
    deferred.prompt();
    const result = await deferred.userChoice;
    if (result.outcome === 'accepted') setShow(false);
    setDeferred(null);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 terminal-panel max-w-xs animate-fade-in">
      <div className="terminal-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Download className="h-3 w-3 text-emerald-500" />
          <span className="text-[10px]">Install EcoOS Core</span>
        </div>
        <button onClick={() => setShow(false)} className="text-emerald-700 hover:text-emerald-500">
          <X className="h-3 w-3" />
        </button>
      </div>
      <div className="terminal-content space-y-3">
        <p className="text-[10px] text-emerald-600 font-mono">
          Install this app on your device for offline access and a native-like experience.
        </p>
        <button
          onClick={handleInstall}
          className="w-full text-[10px] font-mono border border-emerald-700/40 text-emerald-400 py-1.5 hover:bg-emerald-900/20 transition-colors"
        >
          install
        </button>
      </div>
    </div>
  );
}
