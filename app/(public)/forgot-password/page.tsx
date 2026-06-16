'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Terminal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Email is required.'); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });
      if (err) setError(err.message);
      else setSent(true);
    } catch {
      setError('Failed to send reset email.');
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="terminal-panel w-full max-w-md animate-fade-in">
        <div className="terminal-header flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-emerald-500" />
          <span>ecoos — password reset</span>
        </div>

        {sent ? (
          <div className="terminal-content space-y-4">
            <div className="border border-emerald-700/40 bg-emerald-950/20 px-3 py-2 text-xs text-emerald-400 font-mono">
              <span className="text-emerald-500">&gt;</span> Reset link sent! Check your email.
            </div>
            <p className="text-[10px] text-emerald-700">
              If an account exists for {email}, you will receive a password reset link shortly.
            </p>
            <Link href="/login" className="text-emerald-500 hover:text-emerald-400 underline underline-offset-2 text-[10px]">
              back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="terminal-content space-y-5">
            <div>
              <p className="text-xs text-emerald-500/70 font-mono mb-1">$ Reset your password</p>
              <p className="text-[10px] text-emerald-700">Enter your email and we'll send you a reset link.</p>
            </div>

            {error && (
              <div className="border border-red-800/40 bg-red-950/20 px-3 py-2 text-xs text-red-400 font-mono">
                <span className="text-red-600">!</span> {error}
              </div>
            )}

            <Input
              label="Email"
              id="reset-email"
              name="email"
              type="email"
              placeholder="you@org.edu"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span className="text-emerald-500/70">&gt;</span> send reset link</>}
            </Button>

            <p className="text-[10px] text-emerald-700 text-center">
              Remember your password?{' '}
              <Link href="/login" className="text-emerald-500 hover:text-emerald-400 underline underline-offset-2">
                log in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
