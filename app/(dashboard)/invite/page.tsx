'use client';

import { useState, useEffect } from 'react';
import { Send, Copy, Check, Loader2, Users } from 'lucide-react';
import { useAuth } from '@/components/layout/auth-provider';

export default function InvitePage() {
  const { user, team } = useAuth();
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvites();
  }, []);

  async function fetchInvites() {
    try {
      const res = await fetch('/api/invite');
      const data = await res.json();
      setInvites(data);
    } catch {}
    setLoading(false);
  }

  async function generate() {
    setGenerating(true);
    setError('');
    const res = await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId: team?.id || 'team-1' }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); } else {
      await fetchInvites();
    }
    setGenerating(false);
  }

  async function copyToClipboard(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-mono flex items-center gap-2">
            <Send className="h-4 w-4 text-emerald-500" />
            Invite Members
          </h1>
          <p className="text-[10px] text-emerald-700">Generate invite links to share with your team</p>
        </div>
        <button
          onClick={generate}
          disabled={generating}
          className="flex items-center gap-1.5 text-[10px] font-mono border border-emerald-700/40 text-emerald-400 px-3 py-1.5 hover:bg-emerald-900/20 transition-colors disabled:opacity-50"
        >
          {generating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
          generate invite
        </button>
      </div>

      {error && (
        <div className="border border-red-800/40 bg-red-950/20 px-3 py-2 text-xs text-red-400 font-mono">
          {error}
        </div>
      )}

      <div className="terminal-panel p-4">
        <p className="text-xs text-emerald-400 font-mono mb-2">Quick Share — {team?.name || 'Your Team'}</p>
        <p className="text-[10px] text-emerald-700 mb-4">
          Share the invite link below with colleagues. They will automatically join your team upon signing up. Each code expires after 7 days and can only be used once.
        </p>

        {user && (
          <div className="flex items-center gap-2 text-[10px] text-emerald-700 mb-4">
            <Users className="h-3 w-3" />
            Your role: <span className="text-emerald-500">{user.role}</span>
          </div>
        )}
      </div>

      <h2 className="text-xs font-mono text-emerald-500">Your Invite Codes</h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
        </div>
      ) : invites.length === 0 ? (
        <div className="border border-emerald-800/20 px-4 py-8 text-center text-xs text-emerald-700 font-mono">
          No invite codes yet. Click "generate invite" to create one.
        </div>
      ) : (
        <div className="space-y-2">
          {invites.map((inv, i) => (
            <div key={i} className="terminal-panel flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-3">
                <code className="text-xs text-emerald-300 font-mono">{inv.code}</code>
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${inv.used ? 'bg-red-950/30 text-red-500' : 'bg-emerald-950/30 text-emerald-500'}`}>
                  {inv.used ? 'used' : 'active'}
                </span>
                <span className="text-[9px] text-emerald-700">
                  expires {new Date(inv.expiresAt).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => {
                  const base = window.location.origin;
                  copyToClipboard(`${base}/signup?invite=${inv.code}`, inv.code);
                }}
                className="text-emerald-700 hover:text-emerald-500 transition-colors"
                title="Copy invite link"
              >
                {copiedId === inv.code ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
