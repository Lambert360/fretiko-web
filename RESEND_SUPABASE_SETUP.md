# Resend + Supabase Setup

## 1. Install Dependencies

```bash
npm install resend @supabase/supabase-js
```

## 2. Environment Variables (.env.local)

```env
# Resend (Free tier: 3,000 emails/month)
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=welcome@fretiko.com

# Supabase
SUPABASE_URL=https://your_project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 3. Supabase Setup

### Create Supabase Project:
1. Go to [Supabase](https://supabase.com/)
2. Create new project: "Fretiko Email Collection"
3. Wait for project to be ready (2-3 minutes)

### Create Table:
1. Go to Table Editor
2. Create new table: "emails"
3. Add columns:
   - `id` (uuid, primary key, default: uuid_generate_v4())
   - `email` (text, not null)
   - `created_at` (timestamp, default: now())
   - `source` (text, default: 'download_modal')

### SQL for table creation:
```sql
CREATE TABLE emails (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'download_modal'
);

-- Add index for faster queries
CREATE INDEX idx_emails_email ON emails(email);
```

### Get Keys:
1. Project Settings → API
2. Copy Project URL
3. Copy Service Role Key (keep secret!)

## 4. Resend Setup

### Sign up for Resend:
1. Go to [Resend](https://resend.com/)
2. Create account (free tier: 3,000 emails/month)
3. Get API key from dashboard
4. Verify domain (or use Resend's default)

## 5. Test Email Collection

### Test API Endpoint:
```bash
curl -X POST http://localhost:3000/api/collect-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Check Supabase:
1. Go to Table Editor
2. View "emails" table
3. Verify new records with email, timestamp, source

## 6. Email Template Features

The welcome email includes:
- **City in the Clouds** theme
- **Digital nation** messaging
- **Anticipation building** content
- **Citizen of the future** positioning
- **Download confirmation**

## 7. Production Deployment

### Vercel Environment Variables:
1. Go to Vercel project settings
2. Add all Supabase and Resend environment variables
3. Redeploy

### Supabase Security:
- Row Level Security (RLS) enabled
- Service role key for server operations
- Public key for client operations (not used here)

## 8. Monitoring

### Supabase Dashboard:
- Real-time table viewer
- Query performance
- Storage usage
- API logs

### Resend Dashboard:
- Email delivery status
- Open/click rates
- Bounce handling

## 9. Benefits of Supabase

✅ **PostgreSQL**: Full SQL database
✅ **Real-time**: Live subscriptions
✅ **Free tier**: 500MB storage, 50k requests/month
✅ **Secure**: Built-in RLS and authentication
✅ **Easy**: No server management needed
✅ **Open Source**: Self-hostable option

## 10. Data Structure

Each email record contains:
```sql
{
  id: "uuid",
  email: "user@example.com",
  created_at: "2024-02-24T18:36:00.000Z",
  source: "download_modal"
}
```

## 11. Row Level Security (Optional)

Enable RLS for additional security:
```sql
-- Enable RLS
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Policy for server-side operations
CREATE POLICY "Server can insert emails" ON emails
  FOR INSERT WITH CHECK (true);

-- Policy for server-side operations
CREATE POLICY "Server can select emails" ON emails
  FOR SELECT USING (true);
```

## 12. Testing Flow

1. Enter test email in download modal
2. Check Vercel function logs
3. Verify email arrives in inbox
4. Check Supabase table for new record
5. Test APK download functionality

## 13. Production Checklist

- [ ] Supabase project created
- [ ] Emails table created
- [ ] Service role key obtained
- [ ] Resend account set up
- [ ] Environment variables added
- [ ] Email template tested
- [ ] API endpoint tested
- [ ] Error handling verified
- [ ] RLS policies configured (optional)
