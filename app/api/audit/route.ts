import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { getAuditLog } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userEmail = searchParams.get('user');

    let logs = getAuditLog();

    if (action) logs = logs.filter(l => l.action.toLowerCase().includes(action.toLowerCase()));
    if (userEmail) logs = logs.filter(l => l.userEmail.toLowerCase().includes(userEmail.toLowerCase()));

    return NextResponse.json(logs.slice(0, 200));
  } catch {
    return NextResponse.json([]);
  }
}
