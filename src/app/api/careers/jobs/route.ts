import { NextRequest, NextResponse } from 'next/server'

// Backend configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

export async function GET() {
  try {
    // Fetch published job listings from backend
    const response = await fetch(`${BACKEND_URL}/public/job-listings`, {
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
      jobs: result.data || []
    })
  } catch (error) {
    console.error('Job listings fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job listings' },
      { status: 500 }
    )
  }
}

// Note: POST, PUT, DELETE operations are handled by admin panel
// This route only serves published job listings to the public website
