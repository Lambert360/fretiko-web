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
      subject: 'Welcome to Fretiko City',
      replyTo: 'no-reply@fretiko.com',
      headers: {
        'X-Entity-Ref-ID': 'fretiko-welcome',
        'List-Unsubscribe': '<mailto:unsubscribe@fretiko.com>',
      },
      text: `Welcome to Fretiko City!

Your journey to the digital realm has just begun!

You've discovered something extraordinary. Fretiko isn't just a social network—it's a digital nation where freedom meets connection.

What's Coming:
• Revolutionary social shopping experience
• Borderless digital community  
• AI-powered discovery engine
• Personalized to your digital soul
• Community powered digital nation

The future is here. Claim your space.

 2024 Fretiko - Building digital nation.

To unsubscribe, reply to this email.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="color-scheme" content="light dark">
          <meta name="supported-color-schemes" content="light dark">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            /* iOS Mail specific fixes */
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              color: #333333;
              -webkit-text-size-adjust: 100%;
            }
            
            /* iOS dark mode support */
            @media (prefers-color-scheme: dark) {
              body {
                background-color: #000000 !important;
                color: #ffffff !important;
              }
            }
            
            /* iOS Mail doesn't support media queries, so use inline styles as fallback */
            .container {
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              border: 1px solid #e5e7eb;
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding: 30px 20px;
            }
            
            .title {
              font-size: 28px;
              margin-bottom: 10px;
              font-weight: bold;
              color: #10b981;
            }
            
            .subtitle {
              font-size: 16px;
              margin-bottom: 0;
              color: #6b7280;
            }
            
            .hero-section {
              padding: 30px;
              margin: 0 20px;
              border-radius: 12px;
              background: #1e293b;
              background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
              color: #ffffff;
            }
            
            .features-section {
              background-color: #f8f9fa;
              padding: 25px;
              border-radius: 12px;
              margin: 20px;
              border: 1px solid #e5e7eb;
            }
            
            .feature-title {
              font-size: 18px;
              margin-bottom: 15px;
              color: #1f2937;
              font-weight: bold;
            }
            
            .feature-list {
              line-height: 1.8;
              margin: 0;
              padding-left: 20px;
              color: #4b5563;
            }
            
            .cta-section {
              text-align: center;
              margin: 30px 20px;
            }
            
            .highlight-text {
              font-weight: bold;
              font-size: 16px;
              color: #10b981;
            }
            
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #9ca3af;
            }
            
            /* Dark mode overrides for iOS */
            [data-color-scheme="dark"] .container {
              background-color: #1c1c1e !important;
              border-color: #38383a !important;
            }
            
            [data-color-scheme="dark"] .features-section {
              background-color: #2c2c2e !important;
              border-color: #38383a !important;
            }
            
            [data-color-scheme="dark"] .feature-title {
              color: #ffffff !important;
            }
            
            [data-color-scheme="dark"] .feature-list {
              color: #aeaeb2 !important;
            }
            
            [data-color-scheme="dark"] .footer {
              border-top-color: #38383a !important;
              color: #8e8e93 !important;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">Welcome to Fretiko City</h1>
              <p class="subtitle">Your journey to the digital realm has just begun!</p>
            </div>
            
            <div class="hero-section">
              <h2 style="font-size: 20px; margin-bottom: 15px; color: #ffffff;">🏙️ City in the Clouds</h2>
              <p style="line-height: 1.6; margin-bottom: 20px; color: #e2e8f0;">
                You've discovered something extraordinary. Fretiko isn't just a social network—it's a digital nation where freedom meets connection.
              </p>
              <p class="highlight-text" style="color: #10b981;">
                "A place where freedom meets connection."
              </p>
            </div>
            
            <div class="features-section">
              <h3 class="feature-title">🚀 What's Coming?</h3>
              <ul class="feature-list">
                <li>✨ Revolutionary social shopping experience</li>
                <li>🌐 Borderless digital community</li>
                <li>💫 AI-powered discovery engine</li>
                <li>🎯 Personalized to your digital soul</li>
                <li>🏛️ Community powered digital nation</li>
              </ul>
            </div>
            
            <div class="cta-section">
              <p class="highlight-text">
                The future is here. Claim your space.
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">
                ©️ 2024 Fretiko - Building digital nation.
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
