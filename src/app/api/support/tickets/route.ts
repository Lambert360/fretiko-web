import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/env-config'

// Backend configuration
const BACKEND_URL = getBackendUrl()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string
    const attachmentFile = formData.get('attachment') as File
    
    // Check if backend is configured
    if (!BACKEND_URL) {
      console.error('❌ BACKEND_URL not configured')
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    // Upload attachment file if provided
    let attachmentUrl = ''
    if (attachmentFile && attachmentFile.size > 0) {
      console.log('Uploading attachment file:', attachmentFile.name)
      
      const uploadFormData = new FormData()
      uploadFormData.append('file', attachmentFile)
      uploadFormData.append('type', 'portfolio')
      
      const uploadResponse = await fetch(`${BACKEND_URL}/public/website-content/upload/support-attachment`, {
        method: 'POST',
        body: uploadFormData,
      })
      
      if (!uploadResponse.ok) {
        throw new Error(`Attachment upload failed: ${uploadResponse.statusText}`)
      }
      
      const uploadResult = await uploadResponse.json()
      console.log('Upload response structure:', uploadResult)
      attachmentUrl = uploadResult.publicUrl  // Use correct field name from service response
      console.log('Attachment uploaded successfully, URL:', attachmentUrl)
    } else {
      console.log('No attachment file provided')
    }
    
    // Submit support message to backend
    const messageData = {
      type: 'contact', // Support messages from website are always 'contact' type
      name,
      email,
      subject,
      message,
      phone: '', // Optional field
      attachmentUrl
    }
    
    console.log('Sending support message data:', messageData)
    
        
    const response = await fetch(`${BACKEND_URL}/public/website-content/support-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || errorData.error || response.statusText
      throw new Error(`Backend error: ${errorMessage}`)
    }
    
    const result = await response.json()
    
    return NextResponse.json({
      success: true,
      ticket: result.data,
      message: 'Support ticket created successfully'
    })
  } catch (error) {
    console.error('Support ticket creation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create support ticket'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

// Note: GET and PUT operations are handled by admin panel
// This route only handles support ticket submissions from the public website
