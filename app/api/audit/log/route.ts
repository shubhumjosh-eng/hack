import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { pushAuditEntry } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { action, resource, details } = await request.json();

    pushAuditEntry({
      userId: user.id,
      userEmail: user.email || 'unknown',
      action,
      resource,
      details: details || '',
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
  }
}
