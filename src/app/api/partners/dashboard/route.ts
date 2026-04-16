import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/env-config'

export async function GET(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Authentication required' 
        },
        { status: 401 }
      )
    }

    // Call backend API
    console.log('📊 Fetching partner dashboard data')
    
    const response = await fetch(`${config.backendUrl}/partners/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('📥 Dashboard API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Dashboard API error:', errorText)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to fetch dashboard data' 
        },
        { status: response.status }
      )
    }

    const result = await response.json()
    console.log('✅ Dashboard data fetched successfully')

    return NextResponse.json({
      success: true,
      data: result.data
    })

  } catch (error) {
    console.error('Dashboard fetch error:', error)
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
