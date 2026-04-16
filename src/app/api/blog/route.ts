import { NextRequest, NextResponse } from 'next/server'

// Backend configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const tags = searchParams.get('tags')
    
    // Build query string
    const queryParams = new URLSearchParams()
    if (search) queryParams.append('search', search)
    if (tags) queryParams.append('tags', tags)
    
    // Fetch published blog posts from backend
    const response = await fetch(`${BACKEND_URL}/public/blog-posts?${queryParams}`, {
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
      posts: result.data || []
    })
  } catch (error) {
    console.error('Blog posts fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}
