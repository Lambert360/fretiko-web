import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check if Supabase environment variables are available
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables not configured. File upload functionality will be disabled.')
}

// Public client for uploads
export const supabaseClient = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Service role client for admin operations (server-side only)
export const supabaseAdmin = supabaseServiceKey && supabaseUrl
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  bucket: string,
  path: string,
  options?: {
    upsert?: boolean
    cacheControl?: string
  }
): Promise<UploadResult> {
  if (!supabaseClient) {
    return { 
      success: false, 
      error: 'Supabase not configured. Please set environment variables.' 
    }
  }

  try {
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .upload(path, file, {
        upsert: options?.upsert ?? false,
        cacheControl: options?.cacheControl ?? '3600'
      })

    if (error) {
      console.error('Upload error:', error)
      return { success: false, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      success: true,
      url: urlData.publicUrl
    }
  } catch (error) {
    console.error('Upload error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }
  }
}

/**
 * Upload multiple files
 */
export async function uploadFiles(
  files: File[],
  bucket: string,
  folder: string,
  filePrefix: string = 'doc'
): Promise<UploadResult[]> {
  if (!supabaseClient) {
    return [{ 
      success: false, 
      error: 'Supabase not configured. Please set environment variables.' 
    }]
  }

  const results: UploadResult[] = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const fileExtension = file.name.split('.').pop() || ''
    const fileName = `${filePrefix}_${Date.now()}_${i}.${fileExtension}`
    const path = `${folder}/${fileName}`
    
    const result = await uploadFile(file, bucket, path)
    results.push(result)
  }
  
  return results
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabaseAdmin) {
    return { 
      success: false, 
      error: 'Supabase not configured. Please set environment variables.' 
    }
  }

  try {
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([path])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Delete failed' 
    }
  }
}

/**
 * Get file info from Supabase Storage
 */
export async function getFileInfo(
  bucket: string,
  path: string
) {
  if (!supabaseAdmin) {
    return { success: false, error: 'Supabase not configured. Please set environment variables.' }
  }

  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .list(path.split('/').slice(0, -1).join('/'), {
        search: path.split('/').pop()
      })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data[0] }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Get file info failed' 
    }
  }
}

/**
 * Validate file type and size
 */
export function validateFile(file: File, options: {
  maxSizeMB?: number
  allowedTypes?: string[]
}): { valid: boolean; error?: string } {
  const maxSizeMB = options?.maxSizeMB ?? 10
  const allowedTypes = options?.allowedTypes ?? [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  // Check file size
  const fileSizeMB = file.size / (1024 * 1024)
  if (fileSizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`
    }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`
    }
  }

  return { valid: true }
}
