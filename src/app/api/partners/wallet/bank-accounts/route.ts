import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/env-config'

async function getToken(request: NextRequest) {
  return request.headers.get('authorization')?.replace('Bearer ', '') ?? null
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })

    const response = await fetch(`${config.backendUrl}/partners/wallet/bank-accounts`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    return NextResponse.json(await response.json(), { status: response.ok ? 200 : response.status })
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })

    const body = await request.json()
    const response = await fetch(`${config.backendUrl}/partners/wallet/bank-accounts`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return NextResponse.json(await response.json(), { status: response.ok ? 200 : response.status })
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
