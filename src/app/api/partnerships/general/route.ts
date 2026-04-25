import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/env-config'

const BACKEND_URL = getBackendUrl()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { name, email, company, phone, partnershipType, message } = body
    
    if (!name || !email || !partnershipType || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if backend is configured
    if (!BACKEND_URL) {
      console.error('❌ BACKEND_URL not configured')
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    // Call backend to save to database
    console.log('🌐 Calling backend to save general partnership application...')
    const response = await fetch(`${BACKEND_URL}/general-partnerships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        company: company || null,
        phone: phone || null,
        partnershipType,
        message,
      }),
    })

    console.log('📥 Backend response status:', response.status)
    console.log('📥 Backend response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.log('❌ Backend error response:', errorData)
      const errorMessage = typeof errorData.message === 'string' ? errorData.message : 'Failed to submit application'
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const application = await response.json()
    console.log('General partnership application received:', application)

    return NextResponse.json({
      success: true,
      message: 'Partnership inquiry submitted successfully',
      applicationId: application.id || application.trackingId
    })

  } catch (error: unknown) {
    console.error('Error submitting partnership application:', error)
    
    // Check if this is a fetch error (network/backend issue)
    if (error instanceof Error && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Failed to connect to backend. Please try again later.' },
        { status: 500 }
      )
    }
    
    // For other errors, return the actual error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit application'
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}

export async function GET() {
  // This would be used by admin panel to fetch applications
  // In real implementation, this would be protected and fetch from database
  
  return NextResponse.json({
    applications: [],
    message: 'This endpoint should be protected and fetch from database'
  })
}
