import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('cookie') || '';
    const supabase = createServiceClient();

    const { data: { user } } = await supabase.auth.getUser(
      authHeader.includes('sb-') ? undefined : undefined
    );

    const { data: sessions, error } = await supabase.auth.admin.listSessions();

    if (error) {
      return NextResponse.json({ error: 'Failed to list sessions' }, { status: 500 });
    }

    const result = (sessions || []).map(s => ({
      id: s.id,
      created_at: s.created_at,
      user_agent: s.user_agent || null,
      ip: s.ip || null,
      is_current: s.id === (request.cookies.get('sb-session-id')?.value || ''),
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.auth.admin.deleteSession(sessionId);

    if (error) {
      return NextResponse.json({ error: 'Failed to revoke session' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
