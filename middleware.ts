import { NextResponse, type NextRequest } from 'next/server';

const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 30;
const API_RATE_LIMIT_MAX = 15;
const requestLog = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, max: number): boolean {
  const now = Date.now();
  const entry = requestLog.get(ip);
  if (!entry || now > entry.resetAt) {
    requestLog.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > max;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (pathname.startsWith('/api/')) {
    if (checkRateLimit(`api:${ip}`, API_RATE_LIMIT_MAX)) {
      return NextResponse.json({ error: 'Too many requests', code: 'RATE_LIMITED' }, { status: 429 });
    }
  } else if (pathname.startsWith('/_next/') || pathname.startsWith('/static/')) {
    return response;
  } else {
    if (checkRateLimit(`page:${ip}`, RATE_LIMIT_MAX)) {
      return NextResponse.json({ error: 'Too many requests', code: 'RATE_LIMITED' }, { status: 429 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg).*)',
  ],
};
