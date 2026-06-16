'use client';

import { useState, useEffect } from 'react';
import { Shield, Key, Ban, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/layout/auth-provider';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: string;
  is_mock: boolean;
  banned: boolean;
  confirmed: boolean;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch {
      setError('Failed to load users');
    }
    setLoading(false);
  }

  async function changeRole(userId: string, role: string) {
    setError('');
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, updates: { role } }),
    });
    const data = await res.json();
    if (!data.ok) { setError('Failed to update role'); return; }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  }

  async function toggleBan(userId: string, banned: boolean) {
    setError('');
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, updates: { ban: !banned } }),
    });
    const data = await res.json();
    if (!data.ok) { setError('Failed to update user'); return; }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, banned: !banned } : u));
  }

  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="border border-red-800/40 bg-red-950/20 px-6 py-4 text-xs text-red-400 font-mono">
          <AlertTriangle className="h-4 w-4 inline mr-2" />
          Access denied. Admin privileges required.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-mono flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" />
            Admin Panel
          </h1>
          <p className="text-[10px] text-emerald-700">User management and system administration</p>
        </div>
        <button onClick={fetchUsers} className="text-[10px] text-emerald-500/50 hover:text-emerald-400 font-mono">
          refresh
        </button>
      </div>

      {error && (
        <div className="border border-red-800/40 bg-red-950/20 px-3 py-2 text-xs text-red-400 font-mono">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
        </div>
      ) : (
        <div className="terminal-panel overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-emerald-800/20 text-[10px] text-emerald-600 uppercase tracking-wider">
                <th className="text-left py-2 px-3">User</th>
                <th className="text-left py-2 px-3">Email</th>
                <th className="text-left py-2 px-3">Role</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-right py-2 px-3">Created</th>
                <th className="text-right py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800/10">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-emerald-900/5 transition-colors">
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-emerald-900/30 flex items-center justify-center text-[9px] text-emerald-400 font-bold">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-emerald-300">{u.name}</span>
                      {u.is_mock && <span className="text-[8px] text-yellow-600 border border-yellow-800/30 px-1">DEMO</span>}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-emerald-500/70">{u.email}</td>
                  <td className="py-2 px-3">
                    <select
                      value={u.role}
                      onChange={e => changeRole(u.id, e.target.value)}
                      disabled={u.is_mock}
                      className="bg-transparent border border-emerald-800/30 text-emerald-300 text-[10px] px-1 py-0.5 rounded"
                    >
                      <option value="admin">admin</option>
                      <option value="editor">editor</option>
                      <option value="viewer">viewer</option>
                    </select>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1">
                      {u.confirmed ? (
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Key className="h-3 w-3 text-yellow-500" />
                      )}
                      {u.banned && <Ban className="h-3 w-3 text-red-500" />}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-700">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {!u.is_mock && (
                      <button
                        onClick={() => toggleBan(u.id, u.banned)}
                        className={`text-[9px] px-2 py-0.5 rounded border ${
                          u.banned
                            ? 'border-emerald-800/30 text-emerald-500 hover:bg-emerald-900/20'
                            : 'border-red-800/30 text-red-400 hover:bg-red-900/20'
                        }`}
                      >
                        {u.banned ? 'unban' : 'ban'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
