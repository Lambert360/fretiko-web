import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/env-config'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })

    const response = await fetch(`${config.backendUrl}/partners/wallet/bank-accounts/${params.id}/default`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
    return NextResponse.json(await response.json(), { status: response.ok ? 200 : response.status })
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })

    const response = await fetch(`${config.backendUrl}/partners/wallet/bank-accounts/${params.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    return NextResponse.json(await response.json(), { status: response.ok ? 200 : response.status })
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
