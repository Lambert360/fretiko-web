// Email collection API endpoint with Resend + Supabase
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

// Supabase setup
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Simple rate limiting (in production, use Redis or database)
const rateLimit = new Map<string, { count: number; lastReset: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 5

  const record = rateLimit.get(ip)
  
  if (!record || now - record.lastReset > windowMs) {
    rateLimit.set(ip, { count: 1, lastReset: now })
    return true
  }
  
  if (record.count >= maxRequests) {
    return false
  }
  
  record.count++
  return true
}

async function storeEmailInSupabase(email: string) {
  try {
    const { data, error } = await supabase
      .from('emails')
      .upsert([
        {
          email: email,
          created_at: new Date().toISOString(),
          source: 'download_modal'
        }
      ], {
        onConflict: 'email' // Handle duplicates by updating existing
      })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return false
    }

    console.log('Email stored/updated in Supabase:', data)
    return true
  } catch (error) {
    console.error('Supabase storage error:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown'
    
    if (!checkRateLimit(clientIP)) {
      return Response.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { email } = await request.json()
    
    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }
    
    // Store in Supabase
    const stored = await storeEmailInSupabase(email)
    if (!stored) {
      return Response.json(
        { error: 'Failed to store email. Please try again.' },
        { status: 500 }
      )
    }
    
    // Send welcome email with Resend
    const emailSent = await sendWelcomeEmail(email)
    if (!emailSent) {
      console.warn('Email failed to send but was stored:', email)
    }
    
    return Response.json(
      { success: true, message: 'Welcome email sent!' },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Email collection error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendWelcomeEmail(email: string): Promise<boolean> {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'welcome@fretiko.com',
      to: [email],
      subject: 'Welcome to Fretiko City 🌟',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #10b981; font-size: 32px; margin-bottom: 10px;">Welcome to Fretiko City</h1>
            <p style="color: #6b7280; font-size: 18px;">Your journey to digital realm have just begun!</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
            <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 15px;">🏙️ City in the Clouds</h2>
            <p style="color: #e2e8f0; line-height: 1.6; margin-bottom: 20px;">
              You've just discovered something extraordinary. Fretiko isn't just a social network—it's a digital nation being born in clouds, where freedom meets connection and boundaries dissolve.
            </p>
            <p style="color: #10b981; font-weight: bold; font-size: 18px;">
              "A place where freedom meets connection."
            </p>
          </div>
          
          <div style="background: #f3f4f6; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
            <h3 style="color: #1f2937; font-size: 20px; margin-bottom: 15px;">🚀 What's Coming?</h3>
            <ul style="color: #4b5563; line-height: 1.8;">
              <li>✨ Revolutionary social shopping experience</li>
              <li>🌐 Borderless digital community</li>
              <li>💫 AI-powered discovery engine</li>
              <li>🎯 Personalized to your digital soul</li>
              <li>🏛️ Community powered digital nation</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #10b981; font-weight: bold; font-size: 18px;">
              The future is here. - Claim your space.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 14px;">
              ©️ 2024 Fretiko - Building digital nation.
            </p>
          </div>
        </div>
      `
    })

    console.log('Welcome email sent to:', email)
    return true
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}
