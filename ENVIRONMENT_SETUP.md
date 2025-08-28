# Environment Setup Guide

## Local Development

To run the application locally with full functionality, create a `.env.local` file in the project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lteaupjgbmagtwhxtpym.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZWF1cGpnYm1hZ3R3aHh0cHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNjMzOTUsImV4cCI6MjA3MTkzOTM5NX0.hxpQgzdn2slX7gd0_cCUfslTMQQylW-6nmp6VfEWNPw
```

## Vercel Deployment

For Vercel deployment, add these environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Fallback Mode

If environment variables are not set, the application will:
- Use fallback data for demonstration purposes
- Show warning messages in the console
- Allow full CRUD operations with mock data
- Maintain all UI functionality

## Database Status

The Supabase database is fully configured with:
- ✅ Users table with demo data
- ✅ Courses table with YouTube links
- ✅ Content items with embedded videos
- ✅ All necessary indexes and RLS policies

## Testing

You can test the application in both modes:
1. **With Environment Variables**: Full database connectivity
2. **Without Environment Variables**: Fallback mode with mock data 