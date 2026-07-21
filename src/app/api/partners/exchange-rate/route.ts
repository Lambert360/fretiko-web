import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/env-config'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const localAmount = searchParams.get('localAmount')
  const localCurrency = searchParams.get('localCurrency')

  if (!localAmount || !localCurrency) {
    return NextResponse.json(
      { error: 'localAmount and localCurrency are required' },
      { status: 400 }
    )
  }

  try {
    const backendUrl = config.backendUrl
    const response = await fetch(
      `${backendUrl}/wallet/deposit/rate?localAmount=${localAmount}&localCurrency=${encodeURIComponent(localCurrency.toUpperCase())}`
    )
    const data = await response.json()
    return NextResponse.json(data, { status: response.ok ? 200 : 400 })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch exchange rate' }, { status: 500 })
  }
}
