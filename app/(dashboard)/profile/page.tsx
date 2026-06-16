'use client';

import { useState } from 'react';
import { useAuth } from '@/components/layout/auth-provider';
import { createClient } from '@/lib/supabase';
import { Terminal, Loader2, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { user, team, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleUpdatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) setError(err.message);
      else {
        setMessage('Password updated successfully.');
        setPassword('');
        setConfirm('');
      }
    } catch {
      setError('Failed to update password.');
    }
    setLoading(false);
  }

  if (!user) return null;

  const isMockUser = ['user-1', 'user-2', 'user-3', 'user-4'].includes(user.id);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2">
        <Terminal className="h-4 w-4 text-emerald-500" />
        <h2 className="text-lg font-bold text-emerald-400 uppercase tracking-wider">Profile</h2>
      </div>

      <div className="terminal-panel">
        <div className="terminal-header">
          <span>{user.name}</span>
        </div>
        <div className="terminal-content space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-emerald-800/20">
            <span className="text-emerald-600">Email</span>
            <span className="text-emerald-300">{user.email}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-emerald-800/20">
            <span className="text-emerald-600">Role</span>
            <span className="text-emerald-300 uppercase">{user.role}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-emerald-800/20">
            <span className="text-emerald-600">Team</span>
            <span className="text-emerald-300">{team?.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-emerald-600">User ID</span>
            <span className="text-emerald-300 text-[10px] truncate max-w-[250px]">{user.id}</span>
          </div>
        </div>
      </div>

      {isMockUser ? (
        <div className="border border-amber-800/40 bg-amber-950/20 p-4 flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300/80">
            Demo account — password changes are not available. Create a real account to manage your password.
          </p>
        </div>
      ) : (
        <div className="terminal-panel">
          <div className="terminal-header">
            <span>change password</span>
          </div>
          <form onSubmit={handleUpdatePassword} className="terminal-content space-y-4">
            {error && (
              <div className="border border-red-800/40 bg-red-950/20 px-3 py-2 text-xs text-red-400 font-mono">
                <span className="text-red-600">!</span> {error}
              </div>
            )}
            {message && (
              <div className="border border-emerald-700/40 bg-emerald-950/20 px-3 py-2 text-xs text-emerald-400 font-mono">
                <span className="text-emerald-500">&gt;</span> {message}
              </div>
            )}
            <Input
              label="New Password"
              id="profile-password"
              name="password"
              type="password"
              placeholder="at least 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm Password"
              id="profile-confirm"
              name="confirm"
              type="password"
              placeholder="repeat password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span className="text-emerald-500/70">&gt;</span> update password</>}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
