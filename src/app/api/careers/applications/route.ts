import { NextRequest, NextResponse } from 'next/server'

// Backend configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const jobId = formData.get('jobId') as string
    const jobTitle = formData.get('jobTitle') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const experience = formData.get('experience') as string
    const education = formData.get('education') as string
    const portfolio = formData.get('portfolio') as string
    const coverLetter = formData.get('coverLetter') as string
    const resumeFile = formData.get('resume') as File
    
    // Upload resume file if provided
    let resumeUrl = ''
    // Check if backend is configured
    if (!BACKEND_URL) {
      console.error(' BACKEND_URL not configured')
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    if (resumeFile && resumeFile.size > 0) {
      console.log('Uploading resume file:', resumeFile.name)
      
      const uploadFormData = new FormData()
      uploadFormData.append('file', resumeFile)
      uploadFormData.append('applicationId', jobId) // Required field
      uploadFormData.append('fileType', 'resume') // Required field
      
      const uploadResponse = await fetch(`${BACKEND_URL}/public/website-content/upload/job-application-file`, {
        method: 'POST',
        body: uploadFormData,
      })
      
      console.log('Resume upload response status:', uploadResponse.status)
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text()
        console.log('Resume upload error response:', errorText)
        throw new Error(`Resume upload failed: ${uploadResponse.statusText}`)
      }
      
      const uploadResult = await uploadResponse.json()
      console.log('Resume upload result:', uploadResult)
      resumeUrl = uploadResult.publicUrl  // Use correct field name
      console.log('Resume uploaded successfully, URL:', resumeUrl)
    } else {
      console.log('No resume file provided')
    }
    
    // Submit application to backend
    const applicationData = {
      jobId,
      jobTitle,
      name,
      email,
      phone,
      experience,
      education,
      portfolio,
      coverLetter,
      resume: resumeUrl  // Use correct field name from DTO
    }
    
    console.log('Sending job application data:', applicationData)
    
    const response = await fetch(`${BACKEND_URL}/public/website-content/job-applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('Job application error response:', errorText)
      throw new Error(`Backend error: ${response.statusText}`)
    }
    
    const result = await response.json()
    
    return NextResponse.json({
      success: true,
      application: result.data,
      message: 'Application submitted successfully'
    })
  } catch (error) {
    console.error('Job application submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}

// Note: GET and PUT operations are handled by admin panel
// This route only handles job application submissions from the public website
