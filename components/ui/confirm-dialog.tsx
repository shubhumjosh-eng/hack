'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'confirm', onConfirm, onCancel }: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in" onClick={onCancel}>
      <div className="terminal-panel max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="terminal-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
            <span className="text-xs">{title}</span>
          </div>
          <button onClick={onCancel} className="text-emerald-700 hover:text-emerald-500">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="terminal-content space-y-4">
          <p className="text-[11px] text-emerald-600 font-mono">{message}</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={onCancel}
              className="text-[10px] font-mono border border-emerald-800/30 text-emerald-500 px-3 py-1.5 hover:bg-emerald-900/10 transition-colors"
            >
              cancel
            </button>
            <button
              onClick={onConfirm}
              className="text-[10px] font-mono border border-red-800/40 text-red-400 px-3 py-1.5 hover:bg-red-900/20 transition-colors"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
