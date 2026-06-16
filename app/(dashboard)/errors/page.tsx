'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/layout/auth-provider';
import { Terminal, Loader2, RefreshCw, Search, Copy, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AuthError {
  id: number;
  email: string;
  action: string;
  error_message: string;
  user_agent: string | null;
  created_at: string;
}

export default function ErrorsPage() {
  const { user } = useAuth();
  const [errors, setErrors] = useState<AuthError[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  async function loadErrors() {
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch('/api/auth/error-log');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setErrors(Array.isArray(data) ? data : []);
    } catch {
      setFetchError('Could not load error log.');
    }
    setLoading(false);
  }

  useEffect(() => {
    loadErrors();
  }, []);

  const filtered = search
    ? errors.filter(e =>
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        e.error_message.toLowerCase().includes(search.toLowerCase()) ||
        e.action.toLowerCase().includes(search.toLowerCase())
      )
    : errors;

  async function copyError(err: AuthError) {
    const text = [
      `[${err.created_at}] ${err.action.toUpperCase()} - ${err.email}`,
      `Error: ${err.error_message}`,
      err.user_agent ? `UA: ${err.user_agent}` : '',
    ].filter(Boolean).join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(err.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            Auth Error Log
          </h2>
          <p className="text-[10px] text-emerald-600 mt-1">
            Failed login and signup attempts across all devices
          </p>
        </div>
        <button
          onClick={loadErrors}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] border border-emerald-700/40 text-emerald-500 hover:border-emerald-500/60 disabled:opacity-40"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          refresh
        </button>
      </div>

      {errors.length > 0 && (
        <div className="max-w-xs">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-emerald-600" />
            <input
              type="text"
              placeholder="filter by email or error..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 text-[11px] bg-gray-950 border border-emerald-800/30 text-emerald-300 placeholder-emerald-700 focus:border-emerald-500/60 focus:outline-none font-mono"
            />
          </div>
        </div>
      )}

      {fetchError && (
        <div className="border border-red-800/40 bg-red-950/20 px-3 py-2 text-xs text-red-400 font-mono">
          {fetchError}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="border border-emerald-800/20 p-6 text-center">
          <p className="text-xs text-emerald-600">
            {search ? 'No errors match your filter.' : 'No auth errors recorded.'}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map(err => (
            <div key={err.id} className="border border-red-800/20 bg-red-950/5 p-3">
              <div className="flex items-center justify-between gap-3 text-[10px] text-emerald-600 mb-1">
                <div className="flex items-center gap-3">
                  <span>{new Date(err.created_at).toLocaleString()}</span>
                  <span className="uppercase px-1.5 py-0.5 border border-emerald-800/30">
                    {err.action}
                  </span>
                </div>
                <button
                  onClick={() => copyError(err)}
                  className="text-emerald-700 hover:text-emerald-400 transition-colors"
                  title="Copy error details"
                >
                  {copiedId === err.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
              <div className="text-xs text-emerald-400 font-mono break-all">
                <span className="text-red-400">{err.email}</span>
                <span className="text-emerald-600 mx-2">→</span>
                {err.error_message}
              </div>
              {err.user_agent && (
                <div className="text-[9px] text-emerald-700 mt-1 truncate max-w-full" title={err.user_agent}>
                  {err.user_agent}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
