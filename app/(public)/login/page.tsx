'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/layout/auth-provider';
import { Terminal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const QUICK_LOGIN = [
  { email: 'admin@greenvalley.edu', label: 'Admin — Green Valley Unified' },
  { email: 'editor@greenvalley.edu', label: 'Editor — Green Valley Unified' },
  { email: 'viewer@coastalprep.org', label: 'Viewer — Coastal Prep Schools' },
  { email: 'admin@mercyhealth.org', label: 'Admin — Mercy Health System' },
];

export default function LoginPage() {
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const router = useRouter();

  function getRedirect() {
    if (typeof window === 'undefined') return '/dashboard';
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect && redirect.startsWith('/')) return redirect;
    return '/dashboard';
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errMsg = params.get('error');
    if (errMsg) setError(decodeURIComponent(errMsg));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const data = new FormData(e.currentTarget);
    const email = (data.get('email') as string) || '';
    const password = (data.get('password') as string) || '';
    if (!email || !password) { setError('Email and password are required.'); return; }
    const ok = await login(email, password);
    if (ok) {
      await new Promise(r => setTimeout(r, 0));
      router.push(getRedirect());
    } else setError('Invalid email or password. If you recently signed up, try the forgot password link.');
  }

  function quickFill(email: string, password: string) {
    const el = document.getElementById('login-email') as HTMLInputElement;
    const pw = document.getElementById('login-password') as HTMLInputElement;
    if (el) el.value = email;
    if (pw) pw.value = password;
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="terminal-panel w-full max-w-md animate-fade-in">
        <div className="terminal-header flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-emerald-500" />
          <span>ecoos — authenticate</span>
        </div>

        <form onSubmit={handleSubmit} className="terminal-content space-y-5">
          <div>
            <p className="text-xs text-emerald-500/70 font-mono mb-1">$ Login to EcoOS Core</p>
            <p className="text-[10px] text-emerald-700">Enter your credentials to access the environmental intelligence terminal.</p>
          </div>

          {error && (
            <div className="border border-red-800/40 bg-red-950/20 px-3 py-2 text-xs text-red-400 font-mono">
              <span className="text-red-600">!</span> {error}
            </div>
          )}

          <Input
            label="Email"
            id="login-email"
            name="email"
            type="email"
            placeholder="user@org.edu"
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            id="login-password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span className="text-emerald-500/70">&gt;</span> authenticate</>}
          </Button>

          <p className="text-[10px] text-emerald-700 text-center flex flex-col gap-1">
            <Link href="/forgot-password" className="text-emerald-500 hover:text-emerald-400 underline underline-offset-2">
              forgot password?
            </Link>
            <span>
              No account?{' '}
              <Link href="/signup" className="text-emerald-500 hover:text-emerald-400 underline underline-offset-2">
                register
              </Link>
            </span>
          </p>

          <div className="border-t border-emerald-800/20 pt-4">
            <p className="text-[10px] text-emerald-600 mb-2 uppercase tracking-wider">Quick Demo Access</p>
            <div className="space-y-1.5">
              {QUICK_LOGIN.map(q => (
                <button
                  key={q.email}
                  type="button"
                  onClick={() => quickFill(q.email, 'demo')}
                  className="block w-full text-left text-[11px] text-emerald-500/70 hover:text-emerald-300 font-mono px-2 py-1 border border-transparent hover:border-emerald-800/30 transition-colors"
                >
                  <span className="text-emerald-600">$</span> ssh {q.label}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
