import { NextRequest, NextResponse } from 'next/server';
import { validateInviteCode } from '@/lib/invite';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.json({ valid: false }, { status: 400 });

  const result = validateInviteCode(code);
  return NextResponse.json(result);
}
