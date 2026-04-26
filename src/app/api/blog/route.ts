import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/env-config'

// Force dynamic rendering to ensure env vars are read at request time, not build time
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
    
    const nextResponse = NextResponse.json({
      success: true,
      posts: result.data || []
    })
    
    // Prevent caching of API responses
    nextResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    nextResponse.headers.set('Pragma', 'no-cache')
    nextResponse.headers.set('Expires', '0')
    
    return nextResponse
  } catch (error) {
    console.error('Blog posts fetch error:', error)
    // Return empty data instead of 500 error during build
    return NextResponse.json({
      success: true,
      posts: []
    })
  }
}
