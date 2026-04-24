import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    // Server-side: check env vars
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables are missing')
    }
    
    return createClient(supabaseUrl, supabaseAnonKey)
  }
  
  // Client-side: lazy initialize
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables are missing')
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  
  return supabaseClient
}

export const supabase = new Proxy({} as SupabaseClient, {
  get: (_, prop: string) => {
    const client = getSupabaseClient()
    return (client as any)[prop]
  }
})

export async function uploadFileToSupabase(file: File, bucket: string, folder: string): Promise<string> {
  const client = getSupabaseClient()
  const fileExtension = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExtension}`
  
  const { data, error } = await client.storage
    .from(bucket)
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false
    })
  
  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }
  
  const { data: { publicUrl } } = client.storage
    .from(bucket)
    .getPublicUrl(fileName)
  
  return publicUrl
}
