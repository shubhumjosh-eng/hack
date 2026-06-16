'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/layout/auth-provider';
import { createClient } from '@/lib/supabase';
import { Terminal, Loader2, Smartphone, Monitor, LogOut, RefreshCw } from 'lucide-react';

interface Session {
  id: string;
  created_at: string;
  user_agent: string | null;
  ip: string | null;
  is_current: boolean;
}

export default function SessionsPage() {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  async function loadSessions() {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/sessions');
      const data = await res.json();
      setSessions(Array.isArray(data) ? data : []);
    } catch {
      setSessions([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadSessions();
  }, []);

  async function revokeSession(sessionId: string) {
    setRevoking(sessionId);
    setMessage('');
    try {
      const res = await fetch('/api/auth/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (data.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        setMessage('Session revoked.');
      } else {
        setMessage(data.error || 'Failed to revoke session.');
      }
    } catch {
      setMessage('Failed to revoke session.');
    }
    setRevoking(null);
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-500" />
          <h2 className="text-lg font-bold text-emerald-400 uppercase tracking-wider">Active Sessions</h2>
        </div>
        <button
          onClick={loadSessions}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] border border-emerald-700/40 text-emerald-500 hover:border-emerald-500/60 disabled:opacity-40"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          refresh
        </button>
      </div>

      {message && (
        <div className="border border-emerald-700/40 bg-emerald-950/20 px-3 py-2 text-xs text-emerald-400 font-mono">
          {message}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
        </div>
      )}

      {!loading && sessions.length === 0 && (
        <div className="border border-emerald-800/20 p-6 text-center">
          <p className="text-xs text-emerald-600">No active sessions found.</p>
        </div>
      )}

      {!loading && sessions.length > 0 && (
        <div className="space-y-2">
          {sessions.map(s => (
            <div
              key={s.id}
              className={`border p-4 text-xs flex items-center justify-between ${
                s.is_current ? 'border-emerald-600/40 bg-emerald-950/15' : 'border-emerald-800/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-emerald-500">
                  {s.user_agent?.includes('Mobile') ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-300">
                      {s.user_agent ? parseUA(s.user_agent) : 'Unknown device'}
                    </span>
                    {s.is_current && <span className="text-[8px] text-emerald-500 uppercase border border-emerald-700/30 px-1">current</span>}
                  </div>
                  <p className="text-emerald-600 mt-0.5">
                    {new Date(s.created_at).toLocaleString()}
                    {s.ip && ` · ${s.ip}`}
                  </p>
                </div>
              </div>
              {!s.is_current && (
                <button
                  onClick={() => revokeSession(s.id)}
                  disabled={revoking === s.id}
                  className="text-emerald-700 hover:text-red-400 transition-colors disabled:opacity-40"
                  title="Revoke session"
                >
                  {revoking === s.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function parseUA(ua: string): string {
  if (ua.includes('Chrome/')) return 'Chrome';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edge/')) return 'Edge';
  return 'Browser';
}
