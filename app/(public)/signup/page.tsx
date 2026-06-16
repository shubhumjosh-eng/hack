'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/layout/auth-provider';
import { registerUser } from '@/lib/auth';
import { Terminal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignupPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { login, loading } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const data = new FormData(e.currentTarget);
    const name = (data.get('name') as string) || '';
    const email = (data.get('email') as string) || '';
    const password = (data.get('password') as string) || '';
    const confirm = (data.get('confirm') as string) || '';

    if (!name.trim() || !email.trim() || !password) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      registerUser(email.trim(), name.trim(), password);
      setSuccess(true);
      const ok = await login(email, password);
      if (ok) router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="terminal-panel w-full max-w-md animate-fade-in">
        <div className="terminal-header flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-emerald-500" />
          <span>ecoos — register</span>
        </div>

        <form onSubmit={handleSubmit} className="terminal-content space-y-5">
          <div>
            <p className="text-xs text-emerald-500/70 font-mono mb-1">$ Create a new account</p>
            <p className="text-[10px] text-emerald-700">Register to access the environmental intelligence terminal.</p>
          </div>

          {error && (
            <div className="border border-red-800/40 bg-red-950/20 px-3 py-2 text-xs text-red-400 font-mono">
              <span className="text-red-600">!</span> {error}
            </div>
          )}

          {success && (
            <div className="border border-emerald-700/40 bg-emerald-950/20 px-3 py-2 text-xs text-emerald-400 font-mono">
              <span className="text-emerald-500">&gt;</span> Account created! Logging in...
            </div>
          )}

          <Input
            label="Full Name"
            id="signup-name"
            name="name"
            type="text"
            placeholder="e.g. Alex Rivera"
            autoComplete="name"
            required
          />

          <Input
            label="Email"
            id="signup-email"
            name="email"
            type="email"
            placeholder="you@org.edu"
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            id="signup-password"
            name="password"
            type="password"
            placeholder="at least 6 characters"
            autoComplete="new-password"
            required
          />

          <Input
            label="Confirm Password"
            id="signup-confirm"
            name="confirm"
            type="password"
            placeholder="repeat password"
            autoComplete="new-password"
            required
          />

          <Button type="submit" disabled={loading || success} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span className="text-emerald-500/70">&gt;</span> create account</>}
          </Button>

          <p className="text-[10px] text-emerald-700 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-500 hover:text-emerald-400 underline underline-offset-2">
              log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
