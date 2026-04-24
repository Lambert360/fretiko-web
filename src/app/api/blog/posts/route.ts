import { NextRequest, NextResponse } from 'next/server'

// Backend configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function GET() {
  // If no backend URL configured, return empty data (for static build)
  if (!BACKEND_URL) {
    console.log('No BACKEND_URL configured, returning empty blog posts')
    return NextResponse.json({
      success: true,
      posts: []
    })
  }

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
    // Return empty data instead of 500 error during build
    return NextResponse.json({
      success: true,
      posts: []
    })
  }
}

// Note: POST, PUT, DELETE operations are handled by admin panel
// This route only serves published blog posts to the public website
