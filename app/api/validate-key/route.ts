import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key || typeof key !== 'string' || !key.startsWith('hf_')) {
      return NextResponse.json(
        { valid: false, error: 'Invalid key format. Must start with hf_' },
        { status: 400 }
      );
    }

    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.1-8B-Instruct:fastest',
        messages: [{ role: 'user', content: 'Reply with just the word: ok' }],
        max_tokens: 10,
      }),
    });

    if (response.ok) {
      return NextResponse.json({ valid: true, status: 'connected' });
    }

    if (response.status === 401 || response.status === 403) {
      return NextResponse.json({ valid: false, status: 'invalid_key', error: 'API key rejected by Hugging Face' });
    }

    if (response.status === 429) {
      return NextResponse.json({ valid: false, status: 'rate_limited', error: 'Rate limited. Wait and try again.' });
    }

    return NextResponse.json({ valid: false, status: 'error', error: `Unexpected response: ${response.status}` });
  } catch {
    return NextResponse.json(
      { valid: false, status: 'error', error: 'Could not reach Hugging Face API' },
      { status: 500 }
    );
  }
}
