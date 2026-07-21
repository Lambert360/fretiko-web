import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/env-config'

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const response = await fetch(`${config.backendUrl}/partners/interstate-orders/${params.orderId}/accept`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    })

    const result = await response.json()
    return NextResponse.json(result, { status: response.ok ? 200 : response.status })
  } catch (error) {
    console.error('Interstate order accept error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
