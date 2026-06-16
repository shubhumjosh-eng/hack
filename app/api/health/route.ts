import { NextResponse } from 'next/server';

export async function GET() {
  const checks: Record<string, string> = {};

  checks.status = 'ok';

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const res = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' },
      });
      checks.supabase = res.ok ? 'connected' : `error: ${res.status}`;
    } else {
      checks.supabase = 'not configured';
    }
  } catch {
    checks.supabase = 'unreachable';
  }

  try {
    const hfKey = process.env.HF_API_KEY;
    checks.huggingface = hfKey ? 'configured' : 'not configured';
  } catch {
    checks.huggingface = 'error';
  }

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks,
  });
}
