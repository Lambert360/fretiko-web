import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/env-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { username, password } = body
    
    if (!username || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Username and password are required' 
        },
        { status: 400 }
      )
    }

    // Call backend API
    console.log('🔐 Partner login attempt:', username)
    
    const response = await fetch(`${config.backendUrl}/partners/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    console.log('📥 Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Backend error response:', errorText)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid credentials'
        },
        { status: 401 }
      )
    }

    const result = await response.json()
    console.log('✅ Login successful for:', username)

    return NextResponse.json({
      success: result.success,
      message: result.message,
      partner: result.partner,
      token: result.token,
      requiresPasswordChange: result.requiresPasswordChange
    })

  } catch (error) {
    console.error('Partner login error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Method not allowed' 
    },
    { status: 405 }
  )
}
