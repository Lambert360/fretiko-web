# Production Deployment Checklist

## 1. Environment Variables (.env.local → Vercel)

Add these to Vercel Environment Variables:
```
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=welcome@fretiko.com
SUPABASE_URL=https://your_project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 2. Supabase Production Setup

### Security:
- Enable Row Level Security (RLS)
- Restrict API access
- Set up proper permissions

### SQL for RLS:
```sql
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Server insert emails" ON emails
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Server select emails" ON emails
  FOR SELECT USING (true);
```

## 3. Error Handling Improvements

Add rate limiting and validation:
```typescript
// Add to API route
const rateLimit = new Map<string, number>()

// Rate limit: 1 email per minute per IP
const clientIP = request.headers.get('x-forwarded-for')
if (rateLimit.get(clientIP) > 5) {
  return Response.json({ error: 'Too many requests' }, { status: 429 })
}
```

## 4. Vercel Deployment

### Build Settings:
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

### Environment Variables:
- Add all variables to Vercel
- Mark as sensitive
- Use different values for production

## 5. Monitoring & Analytics

### Supabase:
- Monitor database usage
- Set up alerts for storage
- Track email collection metrics

### Resend:
- Monitor email deliverability
- Track open/click rates
- Set up bounce handling

## 6. Security Checklist

- [ ] Environment variables secured
- [ ] RLS policies enabled
- [ ] Rate limiting implemented
- [ ] Error handling robust
- [ ] HTTPS enforced (Vercel default)
- [ ] CORS configured
- [ ] API keys not exposed

## 7. Performance Optimization

- Enable Vercel Edge Functions
- Optimize images
- Minimize bundle size
- Add caching headers

## 8. Testing Before Deploy

1. Test email collection locally
2. Verify Supabase integration
3. Test Resend email delivery
4. Check error handling
5. Test rate limiting

## 9. Post-Deploy

1. Monitor Vercel logs
2. Check Supabase dashboard
3. Verify email delivery
4. Test production flow
5. Set up monitoring alerts
