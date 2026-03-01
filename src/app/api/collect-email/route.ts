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
      subject: 'Welcome to Fretiko',
      replyTo: 'no-reply@fretiko.com',
      headers: {
        'X-Entity-Ref-ID': 'fretiko-welcome',
        'List-Unsubscribe': '<mailto:unsubscribe@fretiko.com>',
      },
      text: `Welcome to Fretiko

Thank you for joining our community. Your journey in the digital realm begins here.

Fretiko is a social platform where people connect and share experiences in a digital environment.

Features available:
• Social networking experience
• Digital community connection
• Discovery tools
• Personalized experience
• Community-driven platform

We look forward to having you with us.

Best regards,
The Fretiko Team

To unsubscribe, reply to this email.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              color: #333333;
              -webkit-text-size-adjust: 100%;
            }
            
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              border: 1px solid #e5e7eb;
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding: 30px 20px;
            }
            
            .title {
              font-size: 24px;
              margin-bottom: 10px;
              font-weight: bold;
              color: #333333;
            }
            
            .subtitle {
              font-size: 16px;
              margin-bottom: 0;
              color: #666666;
            }
            
            .content-section {
              padding: 25px;
              margin: 0 20px;
            }
            
            .features-section {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px;
              border: 1px solid #e5e7eb;
            }
            
            .feature-title {
              font-size: 18px;
              margin-bottom: 15px;
              color: #333333;
              font-weight: bold;
            }
            
            .feature-list {
              line-height: 1.6;
              margin: 0;
              padding-left: 20px;
              color: #666666;
            }
            
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 14px;
              color: #999999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">Welcome to Fretiko</h1>
              <p class="subtitle">Thank you for joining our community</p>
            </div>
            
            <div class="content-section">
              <p style="line-height: 1.6; margin-bottom: 20px; color: #333333;">
                Fretiko is a social platform where people connect and share experiences in a digital environment.
              </p>
            </div>
            
            <div class="features-section">
              <h3 class="feature-title">Features Available</h3>
              <ul class="feature-list">
                <li>Social networking experience</li>
                <li>Digital community connection</li>
                <li>Discovery tools</li>
                <li>Personalized experience</li>
                <li>Community-driven platform</li>
              </ul>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">
                Best regards,<br>
                The Fretiko Team
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    })

    console.log('Welcome email sent to:', email)
    return true
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}
