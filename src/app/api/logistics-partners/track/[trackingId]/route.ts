import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { trackingId: string } }
) {
  try {
    const trackingId = params.trackingId

    // Validate tracking ID format
    if (!trackingId || typeof trackingId !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid tracking ID' },
        { status: 400 }
      )
    }

    // Call backend API
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001'
    const response = await fetch(`${backendUrl}/logistics-partners/track/${trackingId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LOGISTICS_API_SECRET || 'default-secret'}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || 'Application not found' 
        },
        { status: response.status }
      )
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      application: result.application
    })

  } catch (error) {
    console.error('Tracking API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json(
    { 
      message: 'Method not allowed' 
    },
    { status: 405 }
  )
}
