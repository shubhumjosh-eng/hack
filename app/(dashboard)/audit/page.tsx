'use client';

import { useState, useEffect, useRef } from 'react';
import { ClipboardList, Search, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/layout/auth-provider';

interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  details: string;
  ip: string;
}

export default function AuditPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    fetchLogs();
    timerRef.current = setInterval(fetchLogs, 15_000);
    return () => clearInterval(timerRef.current);
  }, []);

  async function fetchLogs() {
    try {
      const res = await fetch('/api/audit');
      const data = await res.json();
      setLogs(data);
    } catch {}
    setLoading(false);
  }

  const filtered = logs.filter(l =>
    !search || l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.userEmail.toLowerCase().includes(search.toLowerCase()) ||
    l.resource.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-mono flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-emerald-500" />
            Audit Log
          </h1>
          <p className="text-[10px] text-emerald-700">Track user actions across the platform</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-3.5 w-3.5 text-emerald-600" />
        <input
          type="text"
          placeholder="filter by action, user, or resource..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-b border-emerald-800/30 text-xs font-mono text-emerald-300 py-1.5 placeholder:text-emerald-800 focus:outline-none focus:border-emerald-600"
        />
        <span className="text-[10px] text-emerald-700">{filtered.length} entries</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-emerald-800/20 px-4 py-8 text-center text-xs text-emerald-700 font-mono">
          {logs.length === 0 ? 'No audit entries yet. Actions will appear here as users interact with the platform.' : 'No entries match your filter.'}
        </div>
      ) : (
        <div className="terminal-panel overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-emerald-800/20 text-[10px] text-emerald-600 uppercase tracking-wider">
                <th className="text-left py-2 px-3">Time</th>
                <th className="text-left py-2 px-3">User</th>
                <th className="text-left py-2 px-3">Action</th>
                <th className="text-left py-2 px-3">Resource</th>
                <th className="text-left py-2 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800/10">
              {filtered.map(l => (
                <tr key={l.id} className="hover:bg-emerald-900/5 transition-colors">
                  <td className="py-2 px-3 text-emerald-700 whitespace-nowrap text-[10px]">
                    {new Date(l.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-3 text-emerald-300">{l.userEmail}</td>
                  <td className="py-2 px-3">
                    <span className="text-emerald-500">{l.action}</span>
                  </td>
                  <td className="py-2 px-3 text-emerald-500/70">{l.resource}</td>
                  <td className="py-2 px-3 text-emerald-600 max-w-[200px] truncate">{l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
