import { NextRequest, NextResponse } from 'next/server'

// Backend configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

export async function GET() {
  try {
    // Fetch published about content from backend
    const response = await fetch(`${BACKEND_URL}/public/website-content/about-content`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`)
    }

    const result = await response.json()
    
    return NextResponse.json({
      success: true,
      sections: result || []
    })
  } catch (error) {
    console.error('About content fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch about content' },
      { status: 500 }
    )
  }
}
