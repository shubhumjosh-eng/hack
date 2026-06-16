import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email, action, errorMessage, userAgent } = await request.json();
    if (!email || !action || !errorMessage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase
      .from('auth_errors')
      .insert({ email, action, error_message: errorMessage, user_agent: userAgent || null });

    if (error) {
      console.error('Failed to log auth error:', error);
      return NextResponse.json({ error: 'Failed to log error' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('auth_errors')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Failed to fetch auth errors:', error);
      return NextResponse.json({ error: 'Failed to fetch errors' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch errors' }, { status: 500 });
  }
}
