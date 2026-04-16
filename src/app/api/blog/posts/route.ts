import { NextRequest, NextResponse } from 'next/server'

// Backend configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

export async function GET() {
  try {
    // Fetch published blog posts from backend
    const response = await fetch(`${BACKEND_URL}/website-content/blog-posts/published`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      posts: data.data || []
    })
  } catch (error) {
    console.error('Blog posts fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// Note: POST, PUT, DELETE operations are handled by admin panel
// This route only serves published blog posts to the public website
