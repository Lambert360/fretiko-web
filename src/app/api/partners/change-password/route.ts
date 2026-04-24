import { NextRequest, NextResponse } from 'next/server'

const config = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
}

// Helper function to make authenticated requests to backend
async function makeBackendRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${config.backendUrl}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_SECRET}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// POST - Change password (authenticated partner)
export async function POST(request: NextRequest) {
  try {
    // Check if backend is configured
    if (!config.backendUrl) {
      console.error('❌ BACKEND_URL not configured')
      return NextResponse.json(
        { success: false, message: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }
    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Call backend API to change password
    const result = await makeBackendRequest('/partners/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('Change password error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to change password. Please check your current password and try again.' 
      },
      { status: 500 }
    )
  }
}
