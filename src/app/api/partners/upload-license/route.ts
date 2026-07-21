import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BUCKET = 'rider-documents'
const MAX_SIZE_MB = 5

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ success: false, message: 'Storage not configured.' }, { status: 500 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided.' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, message: 'Only images (JPG, PNG, WebP) and PDF files are allowed.' }, { status: 400 })
    }

    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > MAX_SIZE_MB) {
      return NextResponse.json({ success: false, message: `File must be under ${MAX_SIZE_MB}MB.` }, { status: 400 })
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `license_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const storagePath = `driver-licenses/${fileName}`

    const supabase = createClient(supabaseUrl, serviceKey)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Supabase storage upload error:', error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)

    return NextResponse.json({ success: true, url: urlData.publicUrl })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ success: false, message: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
