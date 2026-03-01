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
      replyTo: 'no-reply@fretiko.com',
      headers: {
        'X-Entity-Ref-ID': 'fretiko-welcome',
        'List-Unsubscribe': '<mailto:unsubscribe@fretiko.com>',
      },
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="color-scheme" content="light dark">
          <meta name="supported-color-schemes" content="light dark">
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              color: #333333;
            }
            
            @media (prefers-color-scheme: dark) {
              body {
                background-color: #1a1a1a;
                color: #ffffff;
              }
            }
            
            .container {
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
            }
            
            @media (prefers-color-scheme: dark) {
              .container {
                background-color: #2d2d2d;
              }
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding: 30px 20px;
            }
            
            .title {
              font-size: 32px;
              margin-bottom: 10px;
              font-weight: bold;
            }
            
            .subtitle {
              font-size: 18px;
              margin-bottom: 0;
            }
            
            .hero-section {
              padding: 30px;
              margin: 0 20px;
              border-radius: 12px;
            }
            
            .features-section {
              background-color: #f8f9fa;
              padding: 25px;
              border-radius: 12px;
              margin: 20px;
            }
            
            @media (prefers-color-scheme: dark) {
              .features-section {
                background-color: #404040;
              }
            }
            
            .cta-section {
              text-align: center;
              margin: 30px 20px;
            }
            
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 14px;
            }
            
            @media (prefers-color-scheme: dark) {
              .footer {
                border-top-color: #404040;
              }
            }
            
            .feature-list {
              line-height: 1.8;
              margin: 0;
              padding-left: 20px;
            }
            
            .highlight-text {
              font-weight: bold;
              font-size: 18px;
            }
            
            .download-btn {
              display: inline-block;
              padding: 15px 30px;
              background: linear-gradient(135deg, #10b981, #059669);
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title" style="color: #10b981; margin: 0 0 10px 0;">Welcome to Fretiko City</h1>
              <p class="subtitle" style="color: #6b7280; margin: 0;">Your journey to the digital realm has just begun!</p>
            </div>
            
            <div class="hero-section" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff;">
              <h2 style="font-size: 24px; margin-bottom: 15px;">🏙️ City in the Clouds</h2>
              <p style="line-height: 1.6; margin-bottom: 20px;">
                You've just discovered something extraordinary. Fretiko isn't just a social network—it's a digital nation being born in clouds, where freedom meets connection and boundaries dissolve.
              </p>
              <p class="highlight-text" style="color: #10b981;">
                "A place where freedom meets connection."
              </p>
            </div>
            
            <div class="features-section">
              <h3 style="font-size: 20px; margin-bottom: 15px;">🚀 What's Coming?</h3>
              <ul class="feature-list">
                <li>✨ Revolutionary social shopping experience</li>
                <li>🌐 Borderless digital community</li>
                <li>💫 AI-powered discovery engine</li>
                <li>🎯 Personalized to your digital soul</li>
                <li>🏛️ Community powered digital nation</li>
              </ul>
            </div>
            
            <div class="cta-section">
              <p class="highlight-text" style="color: #10b981; margin-bottom: 20px;">
                The future is here. - Claim your space.
              </p>
              <a href="#" class="download-btn">Download Fretiko</a>
            </div>
            
            <div class="footer">
              <p style="color: #9ca3af; margin: 0;">
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
