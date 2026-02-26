# Email Collection Setup Guide

## 1. Choose Email Service Provider

Pick one of these services for sending welcome emails:

### Recommended Options:
- **Resend** (Easy, modern, $0.10/1000 emails)
- **SendGrid** (Reliable, free tier available)
- **Mailgun** (Powerful, developer-friendly)
- **AWS SES** (Cheapest for high volume)

## 2. Set Up Environment Variables

Create `.env.local` file in root:

```env
# For Resend
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=welcome@fretiko.com

# For SendGrid
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=welcome@fretiko.com
```

## 3. Update the API Route

Replace the placeholder in `src/app/api/collect-email/route.ts` with your chosen service:

### Resend Example:
```bash
npm install resend
```

```typescript
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL,
  to: [email],
  subject: 'Welcome to Fretiko City 🌟',
  html: welcomeEmailTemplate
})
```

## 4. Email Storage Options

### Simple Options:
- **Google Sheets** (Free, easy setup)
- **Airtable** (Free tier, visual)
- **Supabase** (Free tier, real-time)
- **Firebase Firestore** (Free tier, scalable)

### Google Sheets Setup:
1. Create Google Cloud Project
2. Enable Google Sheets API
3. Create service account
4. Share sheet with service account email
5. Use Google Sheets API in route

## 5. Testing

Test the flow:
1. Enter email in download modal
2. Check console for email collection
3. Verify welcome email arrives
4. Check email storage (Google Sheets, etc.)

## 6. Production Deployment

- Add environment variables to Vercel/Netlify
- Test with production domain
- Monitor email deliverability
- Set up email analytics

## Security Notes

- Rate limit email collection
- Add CAPTCHA if needed
- Validate email format
- Never expose API keys in frontend
