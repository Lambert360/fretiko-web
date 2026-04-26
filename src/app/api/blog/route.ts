import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/env-config'

export async function GET(request: NextRequest) {
  // Get backend URL at runtime (not build time) to support env vars set in production
  const BACKEND_URL = getBackendUrl()
  
  console.log('🔍 Blog API - BACKEND_URL:', BACKEND_URL || 'NOT SET')
  
  // If no backend URL configured, return empty data (for static build)
  if (!BACKEND_URL) {
    console.log('❌ No BACKEND_URL configured, returning empty blog posts')
    return NextResponse.json({
      success: true,
      posts: []
    })
  }

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
    // Return empty data instead of 500 error during build
    return NextResponse.json({
      success: true,
      posts: []
    })
  }
}
