import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/env-config';

interface LogisticsApplicationData {
  company_name: string;
  company_registration_number?: string;
  tax_id?: string;
  contact_person_name: string;
  contact_email: string;
  contact_phone?: string;
  company_website?: string;
  headquarters_address: string;
  service_areas: string[];
  operating_hours?: Record<string, { start: string; end: string }>;
  vehicle_fleet: Record<string, { count: number; photos?: string[] }>;
  total_riders?: number;
  average_daily_deliveries?: number;
  years_in_operation?: number;
  insurance_coverage?: Record<string, any>;
  service_categories?: string[];
  companyLogo?: File | null;
  registration_document_urls?: string[];
  insurance_document_urls?: string[];
  fleet_document_urls?: string[];
} 

export async function POST(request: NextRequest) {
  try {
    // Check if backend is configured
    if (!config.backendUrl) {
      console.error('❌ BACKEND_URL not configured')
      return NextResponse.json(
        { 
          success: false, 
          message: 'Server configuration error. Please contact support.' 
        },
        { status: 500 }
      )
    }

    // Handle FormData instead of JSON

    // Check if this is multipart form data (with files)
    const contentType = request.headers.get('content-type') || ''
    const isMultipart = contentType.includes('multipart/form-data')

    let backendData: any = {}
    let companyLogoFile: File | null = null
    let documentFiles: File[] = []

    if (isMultipart) {
      // Handle multipart form data with files
      const formData = await request.formData()
      console.log('📋 Form data received:')
      
      // Extract form fields
      const entries = Array.from(formData.entries())
      for (const [key, value] of entries) {
        if (value instanceof File) {
          if (key === 'companyLogo') {
            companyLogoFile = value
            console.log('Received company logo:', { name: value.name, size: value.size })
          } else if (key === 'registration_documents' || key === 'insurance_documents' || key === 'fleet_documents') {
            documentFiles.push(value)
            console.log('Received document:', { name: value.name, size: value.size })
          }
        } else {
          // Parse JSON fields
          try {
            backendData[key] = JSON.parse(value as string)
            console.log(`📝 ${key}:`, backendData[key])
          } catch {
            backendData[key] = value
            console.log(`📝 ${key}:`, value)
          }
        }
      }
    } else {
      // Handle JSON data (fallback)
      const jsonData = await request.json()
      console.log('📋 JSON data received:', jsonData)
      backendData = jsonData
    }

    // Validate required fields
    const requiredFields = [
      'company_name', 
      'contact_person_name', 
      'contact_email',
      'headquarters_address',
      'service_areas',
      'vehicle_fleet'
    ];

    for (const field of requiredFields) {
      if (!backendData[field] || (Array.isArray(backendData[field]) && backendData[field].length === 0)) {
        return NextResponse.json(
          { 
            success: false, 
            message: `Missing required field: ${field}` 
          },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(backendData.contact_email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    // Create FormData for backend API call (to handle files)
    const backendFormData = new FormData()
    
    // Add all data fields
    Object.entries(backendData).forEach(([key, value]) => {
      if (typeof value === 'object') {
        backendFormData.append(key, JSON.stringify(value))
      } else {
        backendFormData.append(key, String(value))
      }
    })

    // Add company logo if exists
    if (companyLogoFile) {
      backendFormData.append('companyLogo', companyLogoFile)
    }

    // Call backend API
    console.log('🌐 Calling backend at:', config.backendUrl);
    console.log('📦 Environment:', config.isDev ? 'Development' : 'Production');
    
    const response = await fetch(`${config.backendUrl}/logistics-partners/apply`, {
      method: 'POST',
      body: backendFormData, // FormData with files
    })

    console.log('📥 Backend response status:', response.status);
    console.log('📥 Backend response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error response:', errorText);
      return NextResponse.json(
        { 
          success: false, 
          message: `Backend error: ${response.status} ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      trackingId: result.trackingId,
      message: 'Application submitted successfully. Please save your tracking ID for future reference.'
    });

  } catch (error) {
    console.error('Logistics application submission error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Method not allowed' 
    },
    { status: 405 }
  );
}
