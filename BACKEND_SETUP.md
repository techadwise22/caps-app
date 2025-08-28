# 🚀 CAPS App Backend Setup Guide

This guide will help you set up the fully functional backend for the CAPS App with User and Course Management features.

## 📋 Prerequisites

- ✅ Supabase project created
- ✅ Supabase URL and API keys configured
- ✅ Next.js app deployed or running locally

## 🔧 Database Setup

### Step 1: Apply Database Migration

1. **Go to your Supabase Dashboard**
   - Navigate to [supabase.com](https://supabase.com)
   - Open your project dashboard

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Apply the Migration**
   - Copy the content from `supabase/migrations/001_update_courses_and_users.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration

### Step 2: Verify Database Setup

After running the migration, you should have:

✅ **Updated Users Table**
- Added `level` field (Foundation, Intermediate, Final)
- Added `status` field (active, pending)
- Proper constraints and indexes

✅ **New Courses Table**
- Course management with levels and status
- Student and instructor counts
- YouTube link support

✅ **Course YouTube Links Table**
- Store YouTube video links for courses
- Title, URL, and description fields
- Proper ordering and relationships

✅ **Security & Performance**
- Row Level Security (RLS) policies
- Proper indexes for fast queries
- Admin-only access to management features

## 🔑 API Endpoints

### User Management
- `GET /api/users` - List all users with filtering
- `POST /api/users` - Create new user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Course Management
- `GET /api/courses` - List all courses with YouTube links
- `POST /api/courses` - Create new course with YouTube links
- `PUT /api/courses/[id]` - Update course and YouTube links
- `DELETE /api/courses/[id]` - Delete course and all YouTube links

## 🎯 Features Implemented

### User Management
- ✅ **CRUD Operations**: Create, Read, Update, Delete users
- ✅ **Search & Filtering**: By name, email, role, level
- ✅ **Real-time Statistics**: Total users, active users, students, instructors
- ✅ **Admin-only Access**: Secure role-based permissions
- ✅ **Form Validation**: Client and server-side validation

### Course Management
- ✅ **CRUD Operations**: Full course lifecycle management
- ✅ **YouTube Link Support**: Add, edit, remove video links
- ✅ **Video Thumbnails**: Automatic YouTube thumbnail generation
- ✅ **Real-time Statistics**: Course counts and enrollment data
- ✅ **Admin-only Access**: Secure management interface

### YouTube Integration
- ✅ **URL Validation**: Ensures valid YouTube URLs
- ✅ **Thumbnail Generation**: Automatic video previews
- ✅ **Bulk Management**: Add multiple videos per course
- ✅ **Ordering**: Maintain video sequence
- ✅ **Descriptions**: Rich metadata for each video

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Admin-only Policies**: Only admin users can manage data
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error management
- **Audit Trail**: Track all changes with timestamps

## 🚀 Deployment

### Local Development
```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your Supabase credentials

# Run the development server
npm run dev
```

### Production Deployment
1. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

2. **Set Environment Variables**
   - Add your Supabase URL and API keys in Vercel dashboard
   - Ensure all required environment variables are set

3. **Apply Database Migration**
   - Run the migration script in Supabase SQL Editor
   - Verify all tables and policies are created

## 🧪 Testing the Backend

### Test User Management
1. Navigate to `/admin/users`
2. Try adding a new user
3. Test search and filtering
4. Edit and delete users
5. Verify statistics update

### Test Course Management
1. Navigate to `/admin/courses`
2. Create a new course with YouTube links
3. Test YouTube URL validation
4. Edit course details and videos
5. Delete courses and verify cleanup

## 🔍 Troubleshooting

### Common Issues

**"Failed to fetch users/courses"**
- Check Supabase connection
- Verify RLS policies are applied
- Ensure admin user exists

**"Access denied" errors**
- Verify user has admin role
- Check RLS policies in database
- Ensure proper authentication

**YouTube links not saving**
- Check URL format (must be valid YouTube URL)
- Verify course_id foreign key constraint
- Check database permissions

### Debug Steps
1. Check browser console for errors
2. Verify Supabase dashboard for data
3. Test API endpoints directly
4. Check RLS policies in SQL Editor

## 📞 Support

If you encounter issues:

1. **Check the logs**: Browser console and Supabase logs
2. **Verify setup**: Ensure all steps in this guide are completed
3. **Test endpoints**: Use tools like Postman to test API directly
4. **Review policies**: Check RLS policies in Supabase dashboard

## 🎉 Success!

Once you've completed this setup, your CAPS App will have:

- ✅ Fully functional User Management
- ✅ Complete Course Management with YouTube support
- ✅ Secure admin-only access
- ✅ Real-time statistics and updates
- ✅ Professional-grade backend architecture

Your backend is now ready for production use! 🚀 