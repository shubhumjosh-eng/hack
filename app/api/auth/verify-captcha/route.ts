import { NextRequest, NextResponse } from 'next/server';

const RECAPTCHA_SECRET = '6Lee7SItAAAAAIxMt1SD9KCwBdjmAKZsU5Gw3M1y';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET}&response=${token}`,
    });

    const data = await res.json();

    return NextResponse.json({
      success: data.success,
      score: data.score || 0,
    });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
