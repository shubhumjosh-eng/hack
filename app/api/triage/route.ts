import { NextRequest, NextResponse } from 'next/server';
import { triageText } from '@/lib/huggingface';
import { TriageInput, TriageResult } from '@/lib/types';

export const runtime = 'edge';
export const maxDuration = 60;

const HF_API_KEY = process.env.HF_API_KEY;

export async function POST(request: NextRequest) {
  const startTime = performance.now();

  try {
    if (!HF_API_KEY) {
      return NextResponse.json(
        {
          error: 'Hugging Face API key not configured. Set HF_API_KEY environment variable.',
          code: 'CONFIG_ERROR',
        },
        { status: 500 }
      );
    }

    const body: TriageInput = await request.json();

    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        {
          error: 'Invalid input. Provide a non-empty "text" field.',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    if (body.text.length > 10000) {
      return NextResponse.json(
        {
          error: 'Input too long. Maximum 10,000 characters.',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    const result: TriageResult = await triageText(body.text, HF_API_KEY);
    const totalLatency = Math.round(performance.now() - startTime);

    return NextResponse.json(
      {
        ...result,
        totalLatencyMs: totalLatency,
      },
      {
        status: 200,
        headers: {
          'X-Processing-Time': `${totalLatency}ms`,
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const isModelLoading = message.includes('loading');

    return NextResponse.json(
      {
        error: message,
        code: isModelLoading ? 'MODEL_LOADING' : 'PROCESSING_ERROR',
        retryAfter: isModelLoading ? 30 : undefined,
      },
      {
        status: isModelLoading ? 503 : 500,
      }
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
