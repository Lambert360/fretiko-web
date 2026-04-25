import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/env-config'

// Backend configuration
const BACKEND_URL = getBackendUrl()

export async function GET() {
  // If no backend URL configured, return empty data (for static build)
  if (!BACKEND_URL) {
    console.log('No BACKEND_URL configured, returning empty job listings')
    return NextResponse.json({
      success: true,
      jobs: []
    })
  }

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
    // Return empty data instead of 500 error during build
    return NextResponse.json({
      success: true,
      jobs: []
    })
  }
}

// Note: POST, PUT, DELETE operations are handled by admin panel
// This route only serves published job listings to the public website
