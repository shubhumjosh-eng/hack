import { NextRequest, NextResponse } from 'next/server';
import { triageText, triageFallback } from '@/lib/huggingface';
import { TriageInput, TriageResult } from '@/lib/types';
import { requireOrigin, checkRateLimit, safeJsonParse, securityHeaders } from '@/lib/api-auth';
import { sanitizeHtml } from '@/lib/sanitize';

export const runtime = 'edge';
export const maxDuration = 60;

const HF_API_KEY = process.env.HF_API_KEY;

export async function POST(request: NextRequest) {
  const startTime = performance.now();

  const originCheck = requireOrigin(request);
  if (!originCheck.authorized) return originCheck.response;

  const rateCheck = checkRateLimit(request, 15, 60_000);
  if (!rateCheck.authorized) return rateCheck.response;

  try {
    const parseResult = await safeJsonParse<Record<string, unknown>>(request);
    if (parseResult.error) return parseResult.error;

    const rawText = String(parseResult.data?.text ?? '').trim();
    if (!rawText) {
      return NextResponse.json(
        { error: 'Invalid input. Provide a non-empty "text" field.', code: 'VALIDATION_ERROR' },
        { status: 400, headers: securityHeaders() }
      );
    }

    const text = sanitizeHtml(rawText, 10000);
    if (!text) {
      return NextResponse.json(
        { error: 'Invalid input after sanitization.', code: 'VALIDATION_ERROR' },
        { status: 400, headers: securityHeaders() }
      );
    }

    const body: TriageInput = { text };

    let result: TriageResult;
    let usedFallback = false;

    if (HF_API_KEY) {
      try {
        result = await triageText(body.text, HF_API_KEY);
      } catch {
        result = triageFallback(body.text);
        usedFallback = true;
      }
    } else {
      result = triageFallback(body.text);
      usedFallback = true;
    }

    const totalLatency = Math.round(performance.now() - startTime);

    return NextResponse.json(
      { ...result, totalLatencyMs: totalLatency },
      {
        status: 200,
        headers: {
          ...securityHeaders(),
          'X-Processing-Time': `${totalLatency}ms`,
          'X-Triage-Mode': usedFallback ? 'local' : 'llm',
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';

    try {
      const body = await request.json().catch(() => null);
      if (body?.text) {
        const result = triageFallback(body.text);
        return NextResponse.json(
          { ...result, totalLatencyMs: Math.round(performance.now() - startTime) },
          { status: 200, headers: { ...securityHeaders(), 'X-Triage-Mode': 'local-fallback' } }
        );
      }
    } catch {}

    return NextResponse.json(
      { error: message, code: 'PROCESSING_ERROR' },
      { status: 500, headers: securityHeaders() }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'EcoOS Core - Waste Triage API',
    version: '2.4.1',
    model: 'meta-llama/Meta-Llama-3-8B-Instruct',
    status: HF_API_KEY ? 'configured' : 'unconfigured',
    endpoints: {
      POST: '/api/triage - Submit text for environmental triage analysis',
    },
    documentation: 'Send POST request with { "text": "your waste description" }',
  });
}
