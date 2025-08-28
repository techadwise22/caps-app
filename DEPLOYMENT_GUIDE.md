# 🚀 CAPS App Deployment Guide

This guide will help you deploy your CAPS App to GitHub and Vercel.

## 📋 Prerequisites

- ✅ CAPS App codebase ready
- ✅ Git repository initialized
- ✅ GitHub account
- ✅ Vercel account

## 🔧 Step 1: GitHub Repository Setup

### Option A: Create Repository via GitHub CLI (Recommended)

1. **Install GitHub CLI** (if not already installed):
   ```bash
   # Windows (using winget)
   winget install GitHub.cli
   
   # Or download from: https://cli.github.com/
   ```

2. **Login to GitHub**:
   ```bash
   gh auth login
   ```

3. **Create Repository**:
   ```bash
   gh repo create caps-app --public --description "CAPS App - Chartered Accountancy Learning Platform" --source=. --remote=origin --push
   ```

### Option B: Create Repository via GitHub Web Interface

1. **Go to GitHub.com** and sign in
2. **Click "New repository"**
3. **Repository settings**:
   - Name: `caps-app`
   - Description: `CAPS App - Chartered Accountancy Learning Platform`
   - Visibility: Public (or Private)
   - **Don't** initialize with README (we already have one)
4. **Click "Create repository"**

5. **Add remote and push** (run these commands):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/caps-app.git
   git branch -M main
   git push -u origin main
   ```

## 🚀 Step 2: Vercel Deployment

### Option A: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

4. **Follow the prompts**:
   - Link to existing project? → No
   - Project name: `caps-app`
   - Directory: `./` (current directory)
   - Override settings? → No

### Option B: Deploy via Vercel Web Interface

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "New Project"**
3. **Import Git Repository**:
   - Select your `caps-app` repository
   - Framework Preset: Next.js
   - Root Directory: `./`
4. **Configure Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://lteaupjgbmagtwhxtpym.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZWF1cGpnYm1hZ3R3aHh0cHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNjMzOTUsImV4cCI6MjA3MTkzOTM5NX0.hxpQgzdn2slX7gd0_cCUfslTMQQylW-6nmp6VfEWNPw
   ```
5. **Click "Deploy"**

## 🔧 Step 3: Database Setup

### Apply Database Migration

1. **Go to your Supabase Dashboard**:
   - Navigate to [supabase.com](https://supabase.com)
   - Open your project dashboard

2. **Open SQL Editor**:
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Apply Migration**:
   - Copy the content from `supabase/migrations/001_update_courses_and_users.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration

4. **Verify Setup**:
   - Check that all tables are created
   - Verify RLS policies are applied
   - Confirm demo data is inserted

## 🔗 Step 4: Connect GitHub to Vercel (Auto-Deploy)

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Git" section
   - Ensure GitHub integration is connected

2. **Auto-Deploy Settings**:
   - Production Branch: `main`
   - Preview Branches: `develop` (optional)
   - Auto-Deploy: Enabled

## 🧪 Step 5: Test Your Deployment

### Test Admin Panels

1. **User Management**:
   - Navigate to `https://your-app.vercel.app/admin/users`
   - Test adding, editing, and deleting users
   - Verify search and filtering work

2. **Course Management**:
   - Navigate to `https://your-app.vercel.app/admin/courses`
   - Test creating courses with YouTube links
   - Verify all CRUD operations

3. **Content Management**:
   - Navigate to `https://your-app.vercel.app/admin/content`
   - Test content creation with YouTube videos
   - Verify embedded video players work

### Test API Endpoints

1. **Test User API**:
   ```bash
   curl https://your-app.vercel.app/api/users
   ```

2. **Test Course API**:
   ```bash
   curl https://your-app.vercel.app/api/courses
   ```

3. **Test Content API**:
   ```bash
   curl https://your-app.vercel.app/api/content
   ```

## 🔒 Step 6: Security & Environment Variables

### Production Environment Variables

Ensure these are set in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lteaupjgbmagtwhxtpym.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZWF1cGpnYm1hZ3R3aHh0cHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNjMzOTUsImV4cCI6MjA3MTkzOTM5NX0.hxpQgzdn2slX7gd0_cCUfslTMQQylW-6nmp6VfEWNPw
```

### Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to project settings
   - Navigate to "Domains"
   - Add your custom domain

2. **DNS Configuration**:
   - Add CNAME record pointing to your Vercel deployment
   - Wait for DNS propagation

## 📊 Step 7: Monitoring & Analytics

### Vercel Analytics

1. **Enable Analytics**:
   - In Vercel Dashboard → Analytics
   - Enable Web Analytics
   - Add tracking code to your app

### Performance Monitoring

1. **Check Build Logs**:
   - Monitor build performance
   - Optimize bundle size if needed

2. **Monitor API Performance**:
   - Check API response times
   - Monitor error rates

## 🔄 Step 8: Continuous Deployment

### Development Workflow

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes and Commit**:
   ```bash
   git add .
   git commit -m "Add new feature"
   ```

3. **Push and Create PR**:
   ```bash
   git push origin feature/new-feature
   # Create Pull Request on GitHub
   ```

4. **Auto-Deploy Preview**:
   - Vercel will create preview deployment
   - Test changes in preview environment

5. **Merge to Main**:
   - Merge PR to main branch
   - Auto-deploy to production

## 🚨 Troubleshooting

### Common Issues

**Build Failures**:
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors

**API Errors**:
- Verify Supabase connection
- Check environment variables
- Monitor Supabase logs

**Database Issues**:
- Ensure migration is applied
- Check RLS policies
- Verify table structure

### Debug Commands

```bash
# Check build locally
npm run build

# Test API routes locally
npm run dev

# Check Git status
git status

# Check Vercel deployment
vercel ls
```

## 🎉 Success!

Once deployed, your CAPS App will be available at:
- **Production**: `https://your-app.vercel.app`
- **GitHub**: `https://github.com/YOUR_USERNAME/caps-app`

### What's Now Live

✅ **Complete Admin Panels**:
- User Management with CRUD operations
- Course Management with YouTube integration
- Content Management with video embeds

✅ **Full Backend API**:
- RESTful API endpoints
- Supabase database integration
- Real-time data updates

✅ **Professional Features**:
- Responsive design
- Search and filtering
- Statistics dashboards
- YouTube video management

Your CAPS App is now **production-ready** and deployed! 🚀 