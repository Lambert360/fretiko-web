import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/env-config'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })

    const response = await fetch(`${config.backendUrl}/partners/wallet`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
    const result = await response.json()
    return NextResponse.json(result, { status: response.ok ? 200 : response.status })
  } catch (error) {
    console.error('Wallet fetch error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
