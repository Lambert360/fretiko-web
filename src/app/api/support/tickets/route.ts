import { NextRequest, NextResponse } from 'next/server'

// Backend configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string
    const attachmentFile = formData.get('attachment') as File
    
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
      throw new Error(`Backend error: ${response.statusText}`)
    }
    
    const result = await response.json()
    
    return NextResponse.json({
      success: true,
      ticket: result.data,
      message: 'Support ticket created successfully'
    })
  } catch (error) {
    console.error('Support ticket creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create support ticket' },
      { status: 500 }
    )
  }
}

// Note: GET and PUT operations are handled by admin panel
// This route only handles support ticket submissions from the public website
