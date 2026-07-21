import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/env-config';

export async function GET(
  request: NextRequest,
  { params }: { params: { country: string } },
) {
  try {
    const res = await fetch(`${config.backendUrl}/partners/wallet/banks/${params.country}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('Banks API error:', text);
      return NextResponse.json({ status: 'error', data: [], message: 'Failed to fetch banks' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Banks route error:', err);
    return NextResponse.json({ status: 'error', data: [], message: 'Internal server error' }, { status: 500 });
  }
}
