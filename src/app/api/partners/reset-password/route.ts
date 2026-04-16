import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-storage'

const config = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
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

// POST - Request password reset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username } = body

    if (!username) {
      return NextResponse.json(
        { success: false, message: 'Username or email is required' },
        { status: 400 }
      )
    }

    // Call backend API to request password reset
    const result = await makeBackendRequest('/partners/reset-password', {
      method: 'POST',
      body: JSON.stringify({ username }),
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('Password reset request error:', error)
    
    // Return success for security (don't reveal if user exists)
    return NextResponse.json(
      { 
        success: true, 
        message: 'If an account exists, you will receive a password reset code' 
      },
      { status: 200 }
    )
  }
}

// PUT - Confirm password reset
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, newPassword } = body

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Token and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Call backend API to confirm password reset
    const result = await makeBackendRequest('/partners/reset-password/confirm', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('Password reset confirmation error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to reset password. Please check your token and try again.' 
      },
      { status: 500 }
    )
  }
}
