import { NextRequest, NextResponse } from 'next/server'

// Backend configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function GET() {
  // If no backend URL configured, return empty data (for static build)
  if (!BACKEND_URL) {
    console.log('No BACKEND_URL configured, returning empty about content')
    return NextResponse.json({
      success: true,
      sections: []
    })
  }

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
    // Return empty data instead of 500 error during build
    return NextResponse.json({
      success: true,
      sections: []
    })
  }
}
