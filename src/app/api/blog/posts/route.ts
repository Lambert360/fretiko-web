import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/env-config'

// Force dynamic rendering to ensure env vars are read at request time, not build time
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  // Get backend URL at runtime (not build time) to support env vars set in production
  const BACKEND_URL = getBackendUrl()
  
  // If no backend URL configured, return empty data (for static build)
  if (!BACKEND_URL) {
    console.log('No BACKEND_URL configured, returning empty blog posts')
    return NextResponse.json({
      success: true,
      posts: []
    })
  }

  try {
    // Fetch published blog posts from backend (public endpoint)
    const response = await fetch(`${BACKEND_URL}/public/blog-posts`, {
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
