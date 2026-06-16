import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { generateInviteCode, getInvitesByUser } from '@/lib/invite';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { teamId } = await request.json();
    if (!teamId) return NextResponse.json({ error: 'teamId required' }, { status: 400 });

    const code = generateInviteCode(teamId, user.email || 'unknown');
    const link = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hack2-pi.vercel.app'}/signup?invite=${code}`;

    return NextResponse.json({ code, link });
  } catch {
    return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const invites = getInvitesByUser(user.email || 'unknown');
    return NextResponse.json(invites);
  } catch {
    return NextResponse.json([]);
  }
}
