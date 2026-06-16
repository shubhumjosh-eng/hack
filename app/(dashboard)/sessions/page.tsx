'use client';

import { useState } from 'react';
import { useAuth } from '@/components/layout/auth-provider';
import { createClient } from '@/lib/supabase';
import { Terminal, Loader2, Monitor, LogOut, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export default function SessionsPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleLogoutAll() {
    setLoading(true);
    setMessage('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: crypto.randomUUID() + '!Aa1' });
      if (error) {
        setMessage('Failed to invalidate sessions: ' + error.message);
      } else {
        setMessage('Password changed — all other sessions have been invalidated. You will be logged out.');
        setTimeout(() => logout(), 2000);
      }
    } catch {
      setMessage('Failed to invalidate sessions.');
    }
    setLoading(false);
  }

  if (!user) return null;

  const isMockUser = ['user-1', 'user-2', 'user-3', 'user-4'].includes(user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Terminal className="h-4 w-4 text-emerald-500" />
        <h2 className="text-lg font-bold text-emerald-400 uppercase tracking-wider">Active Sessions</h2>
      </div>

      {message && (
        <div className="border border-emerald-700/40 bg-emerald-950/20 px-3 py-2 text-xs text-emerald-400 font-mono">
          {message}
        </div>
      )}

      <div className="border border-emerald-800/20 p-4 text-xs">
        <div className="flex items-center gap-3">
          <Monitor className="h-4 w-4 text-emerald-500" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-300">Current session</span>
              <span className="text-[8px] text-emerald-500 uppercase border border-emerald-700/30 px-1">active</span>
            </div>
            <p className="text-emerald-600 mt-0.5">
              Logged in as {user.email} · {typeof navigator !== 'undefined' ? navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop' : 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      {isMockUser ? (
        <div className="border border-amber-800/40 bg-amber-950/20 p-4 flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300/80">
            Session management is not available for demo accounts. Create a real account to manage sessions.
          </p>
        </div>
      ) : (
        <div className="border border-red-800/20 bg-red-950/5 p-4">
          <div className="flex items-start gap-3">
            <LogOut className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Invalidate All Other Sessions</p>
              <p className="text-[10px] text-red-300/70">
                This will change your password and sign out all other devices. You will be logged out and need to sign in again.
              </p>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowConfirm(true)}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <><LogOut className="h-3 w-3" /> invalidate all</>}
              </Button>
              <ConfirmDialog
                open={showConfirm}
                title="Invalidate All Sessions"
                message="This will change your password and sign out all other devices. You will be logged out and need to sign in again. Continue?"
                confirmLabel="invalidate all"
                onConfirm={() => { setShowConfirm(false); handleLogoutAll(); }}
                onCancel={() => setShowConfirm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
