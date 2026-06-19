import { NextRequest, NextResponse } from 'next/server';

export type AuthResult = { authorized: true } | { authorized: false; response: NextResponse };

const VALID_API_KEYS = new Set([
  ...(process.env.INTERNAL_API_KEYS?.split(',').map(k => k.trim()).filter(Boolean) ?? []),
]);

const ORIGIN_ALLOWLIST = [
  'https://hack2-pi.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
];

export function requireApiKey(request: NextRequest): AuthResult {
  const apiKey = request.headers.get('x-api-key');
  if (apiKey && VALID_API_KEYS.has(apiKey)) {
    return { authorized: true };
  }
  return {
    authorized: false,
    response: NextResponse.json(
      { error: 'Unauthorized — valid x-api-key header required', code: 'AUTH_REQUIRED' },
      { status: 401, headers: securityHeaders() }
    ),
  };
}

export function requireOrigin(request: NextRequest): AuthResult {
  const origin = request.headers.get('origin');
  if (!origin) return { authorized: true };
  if (ORIGIN_ALLOWLIST.some(allowed => origin.startsWith(allowed))) {
    return { authorized: true };
  }
  return {
    authorized: false,
    response: NextResponse.json(
      { error: 'Origin not allowed', code: 'CORS_ERROR' },
      { status: 403, headers: securityHeaders() }
    ),
  };
}

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  request: NextRequest,
  maxRequests: number = 30,
  windowMs: number = 60_000
): AuthResult {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
  const route = request.nextUrl.pathname;
  const key = `${ip}:${route}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { authorized: true };
  }
  entry.count++;
  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Too many requests', code: 'RATE_LIMITED', retryAfterSec: retryAfter },
        { status: 429, headers: { ...securityHeaders(), 'Retry-After': String(retryAfter) } }
      ),
    };
  }
  return { authorized: true };
}

export function securityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  };
}

export async function safeJsonParse<T>(request: NextRequest): Promise<{ data?: T; error?: NextResponse }> {
  try {
    const text = await request.text();
    if (!text || text.length > 100_000) {
      return { error: NextResponse.json(
        { error: 'Request body too large', code: 'PAYLOAD_TOO_LARGE' },
        { status: 413, headers: securityHeaders() }
      )};
    }
    const data = JSON.parse(text) as T;
    return { data };
  } catch {
    return { error: NextResponse.json(
      { error: 'Invalid JSON in request body', code: 'INVALID_JSON' },
      { status: 400, headers: securityHeaders() }
    )};
  }
}
