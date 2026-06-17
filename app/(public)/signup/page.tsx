'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/layout/auth-provider';
import { Terminal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const RECAPTCHA_SITE_KEY = '6Lee7SItAAAAACfifkAALUdpv68XcY2cBWhsSthG';

export default function SignupPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [captchaReady, setCaptchaReady] = useState(false);
  const [captchaBypass, setCaptchaBypass] = useState(false);
  const captchaInitialized = useRef(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteTeam, setInviteTeam] = useState<string | null>(null);
  const { signup, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof grecaptcha !== 'undefined') {
      grecaptcha.ready(() => {
        captchaInitialized.current = true;
        setCaptchaReady(true);
      });
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.onload = () => {
      grecaptcha.ready(() => {
        captchaInitialized.current = true;
        setCaptchaReady(true);
      });
    };
    script.onerror = () => {
      setCaptchaReady(true);
      setCaptchaBypass(true);
    };
    document.head.appendChild(script);
    const timeout = setTimeout(() => {
      if (!captchaInitialized.current) {
        setCaptchaReady(true);
        setCaptchaBypass(true);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('invite');
    if (code) {
      setInviteCode(code);
      fetch('/api/invite/validate?code=' + encodeURIComponent(code))
        .then(r => r.json())
        .then(data => {
          if (data.valid && data.teamId) setInviteTeam(data.teamId);
          else setError('Invalid or expired invite code.');
        })
        .catch(() => setError('Failed to validate invite code.'));
    }
  }, []);

  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500', 'bg-green-500'][strength];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!captchaBypass) {
      let captchaToken = '';
      try {
        captchaToken = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'signup' });
      } catch {
        setError('Security check failed. Please try again.');
        return;
      }

      const verify = await fetch('/api/auth/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: captchaToken }),
      });
      const captchaResult = await verify.json();
      if (!captchaResult.success) {
        setError('Security check failed. Please try again.');
        return;
      }
    }

    const data = new FormData(e.currentTarget);
    const name = (data.get('name') as string) || '';
    const email = (data.get('email') as string) || '';
    const pw = (data.get('password') as string) || '';
    const confirm = (data.get('confirm') as string) || '';

    if (!name.trim() || !email.trim() || !pw) {
      setError('All fields are required.');
      return;
    }
    if (pw.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (pw !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    const err = await signup(email.trim(), pw, name.trim(), inviteTeam || undefined);
    if (err) {
      setError(err);
    } else {
      setSuccess(true);
      router.push('/dashboard');
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
            {inviteCode && (
              <p className="text-[10px] text-emerald-500 mt-2 flex items-center gap-1">
                <span className="text-emerald-600">*</span> Invite code applied
              </p>
            )}
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
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {password && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= strength ? strengthColor : 'bg-emerald-900/30'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-[9px] ${strength >= 4 ? 'text-emerald-500' : strength >= 2 ? 'text-yellow-500' : 'text-red-500'}`}>
                {strengthLabel}
              </p>
            </div>
          )}

          <Input
            label="Confirm Password"
            id="signup-confirm"
            name="confirm"
            type="password"
            placeholder="repeat password"
            autoComplete="new-password"
            required
          />

          <Button type="submit" disabled={loading || success || !captchaReady} className="w-full">
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
