import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { MOCK_USERS } from '@/lib/auth';

export async function GET() {
  try {
    const svc = createServiceClient();
    const { data: { users }, error } = await svc.auth.admin.listUsers();

    const realUsers = (users || []).map(u => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.name || u.email?.split('@')[0] || 'Unknown',
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      role: u.user_metadata?.role || 'editor',
      is_mock: false,
      banned: !!u.banned_until,
      confirmed: !!u.email_confirmed_at,
    }));

    const mockUsers = MOCK_USERS.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      created_at: '2025-09-01T00:00:00Z',
      last_sign_in_at: null,
      role: u.role,
      is_mock: true,
      banned: false,
      confirmed: true,
    }));

    return NextResponse.json([...realUsers, ...mockUsers]);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, updates } = await request.json();
    const svc = createServiceClient();

    if (updates.role) {
      await svc.auth.admin.updateUserById(userId, {
        user_metadata: { role: updates.role },
      });
    }

    if (updates.ban !== undefined) {
      await svc.auth.admin.updateUserById(userId, {
        ban_duration: updates.ban ? '3650d' : '0',
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
