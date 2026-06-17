import { NextResponse, type NextRequest } from 'next/server';

const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 10;
const requestLog = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestLog.get(ip);
  if (!entry || now > entry.resetAt) {
    requestLog.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

const RATE_LIMITED_PATHS = ['/api/auth/error-log', '/api/auth/sessions', '/api/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

  if (RATE_LIMITED_PATHS.some(p => pathname.startsWith(p))) {
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg).*)',
  ],
};
