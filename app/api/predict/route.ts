import { NextRequest, NextResponse } from 'next/server';
import { predictWasteWithLLM, predictWasteLocally } from '@/lib/huggingface';
import { PredictionInput } from '@/lib/types';

export const maxDuration = 60;

const HF_API_KEY = process.env.HF_API_KEY;

const VALID_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const VALID_WEATHER = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Hot', 'Cold', 'Mild', 'Windy'];

export async function POST(request: NextRequest) {
  try {
    const body: PredictionInput = await request.json();

    const errors: string[] = [];
    if (!body.dayOfWeek) errors.push('dayOfWeek is required');
    if (!body.scheduledMenu) errors.push('scheduledMenu is required');
    if (body.expectedAttendance == null || body.expectedAttendance < 1) {
      errors.push('expectedAttendance must be a positive number');
    }
    if (!body.weatherCondition) errors.push('weatherCondition is required');

    if (!VALID_DAYS.includes(body.dayOfWeek)) {
      errors.push(`dayOfWeek must be one of: ${VALID_DAYS.join(', ')}`);
    }
    if (!VALID_WEATHER.includes(body.weatherCondition)) {
      errors.push(`weatherCondition must be one of: ${VALID_WEATHER.join(', ')}`);
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    let result;
    let usedFallback = false;

    if (HF_API_KEY) {
      try {
        result = await predictWasteWithLLM(body, HF_API_KEY);
      } catch {
        result = predictWasteLocally(body);
        usedFallback = true;
      }
    } else {
      result = predictWasteLocally(body);
      usedFallback = true;
    }

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'X-Processing-Time': `${result.metadata.latencyMs}ms`,
        'X-Prediction-Mode': usedFallback ? 'local' : 'llm',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';

    try {
      const body = await request.json().catch(() => null);
      if (body && body.scheduledMenu) {
        const { predictWasteLocally } = await import('@/lib/huggingface');
        const result = predictWasteLocally(body as PredictionInput);
        return NextResponse.json(result, {
          status: 200,
          headers: { 'X-Prediction-Mode': 'local-fallback', 'Cache-Control': 'no-store' },
        });
      }
    } catch {}

    return NextResponse.json(
      { error: message, code: 'PROCESSING_ERROR' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'EcoOS Core — Food Waste Prediction Engine',
    version: '2.5.0',
    model: 'meta-llama/Meta-Llama-3-8B-Instruct',
    status: HF_API_KEY ? 'configured' : 'unconfigured',
    note: 'Using Hugging Face Inference Providers API (router.huggingface.co/v1)',
    endpoint: {
      method: 'POST',
      path: '/api/predict',
      description: 'Submit cafeteria operational data for AI-powered waste prediction',
    },
    input_schema: {
      dayOfWeek: 'string — Monday through Sunday',
      scheduledMenu: 'string — description of the menu (e.g., "Grilled chicken with rice")',
      expectedAttendance: 'number — expected student count',
      weatherCondition: 'string — Sunny, Cloudy, Rainy, Snowy, Hot, Cold, Mild, Windy',
      temperature: 'number (optional) — temperature in °F',
    },
    output_schema: {
      predictedWasteKg: 'number — estimated waste in kilograms',
      actionableInterventions: 'string[] — recommended actions',
      riskWarning: 'string — caveat about synthetic data limitations',
      humanInTheLoopAction: 'string — action requiring human approval before execution',
      metadata: 'object — model info, latency, timestamp',
    },
    responsible_ai: {
      risk_disclaimer: 'All predictions are estimates based on generalized patterns. Always validate against local measurements.',
      human_in_loop: 'Critical actions (supply changes, menu overhauls) require human authorization.',
      bias_notice: 'Model trained on synthetic data — real-world deployment requires local calibration.',
    },
  });
}
