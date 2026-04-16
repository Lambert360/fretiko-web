import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadFileToSupabase(file: File, bucket: string, folder: string): Promise<string> {
  const fileExtension = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExtension}`
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false
    })
  
  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)
  
  return publicUrl
}
