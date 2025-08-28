# CAPS Learn - Educational Platform

A comprehensive educational platform built with Next.js, TypeScript, Tailwind CSS, and Supabase. CAPS Learn provides a modern, scalable solution for educational institutions to manage tests, content, and learning analytics.

## 🚀 Features

### Core Functionality
- **Multi-role Authentication**: Admin, Instructor, Student, and Committee Tester roles
- **Test Management**: Create, assign, and take timed assessments with auto-grading
- **Content Library**: YouTube playlists, videos, files, and interactive content
- **Analytics Dashboard**: Comprehensive insights into student performance
- **Zoom Integration**: Seamless video conferencing for classes
- **Real-time Updates**: Live progress tracking and notifications

### Test Engine
- **Timed Tests**: Configurable duration with auto-submit
- **Multiple Question Types**: Single-choice, multi-choice, numeric, and subjective
- **Section-based Tests**: Organize questions into logical sections
- **Question Navigation**: Easy navigation with status indicators
- **Auto-save**: Automatic response saving every 5-10 seconds
- **Review System**: Mark questions for review and return later

### Content Management
- **YouTube Integration**: Auto-fetch playlists and video metadata
- **File Upload**: Support for PDFs, PPTs, documents, images, and more
- **Content Pages**: Rich text editor with mixed media blocks
- **Progress Tracking**: Monitor student engagement and completion
- **Version Control**: Track content updates and changes

### Analytics & Reporting
- **Student Performance**: Individual and cohort-level analytics
- **Question Analysis**: Difficulty analysis and success rates
- **Export Capabilities**: CSV export for detailed reports
- **Real-time Dashboards**: Live updates on test progress

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context + Hooks
- **UI Components**: Headless UI, Heroicons, Lucide React
- **Charts**: Recharts for data visualization
- **File Handling**: React Player, PapaParse for CSV
- **Animations**: Framer Motion

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Zoom Developer account (for video integration)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd caps-learn
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp env.example .env.local
```

Fill in your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Zoom Integration (Optional)
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_REDIRECT_URI=http://localhost:3000/api/auth/zoom/callback

# YouTube API (Optional)
YOUTUBE_API_KEY=your_youtube_api_key
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the schema file in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase/schema.sql
```

3. Configure Row Level Security (RLS) policies (included in schema)

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 👥 User Roles & Access

### Demo Credentials
- **Email**: demo@capslearn.com
- **Password**: demo123
- **Role**: Committee Tester (read-only access)

### Role Permissions

#### Admin
- Full system access
- User management
- System configuration
- Analytics and reporting

#### Instructor
- Create and manage courses
- Design tests and assignments
- Upload and manage content
- View student analytics
- Schedule classes with Zoom

#### Student
- Take assigned tests
- Access course content
- Track personal progress
- Join scheduled classes

#### Committee Tester
- Read-only access to dashboards
- Preview tests and content
- No modification permissions

## 🏗️ Project Structure

```
caps-learn/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
├── supabase/             # Database schema and migrations
└── public/               # Static assets
```

## 🎨 Design System

The application uses a custom design system inspired by Unacademy with:

- **Primary Color**: Royal Blue (#2563EB)
- **Secondary Color**: Violet (#8B5CF6)
- **Typography**: Inter font family
- **Spacing**: 8px baseline grid
- **Components**: Consistent button, card, and form styles

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Enable Authentication with email provider
3. Configure email templates
4. Set up storage buckets for file uploads
5. Configure RLS policies

### Zoom Integration

1. Create a Zoom App in the Zoom Marketplace
2. Configure OAuth settings
3. Set up webhook endpoints
4. Add environment variables

### YouTube API

1. Create a Google Cloud project
2. Enable YouTube Data API v3
3. Generate API key
4. Add to environment variables

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔒 Security Features

- Row Level Security (RLS) policies
- Role-based access control
- Input validation with Zod
- XSS protection
- CSRF protection
- Secure file uploads

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📊 Performance

- **Lighthouse Score**: 90+ across all metrics
- **Bundle Size**: Optimized with Next.js
- **Image Optimization**: Automatic with Next.js Image component
- **Caching**: Strategic caching for better performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] AI-powered question generation
- [ ] Integration with LMS platforms
- [ ] Multi-language support
- [ ] Offline mode
- [ ] Advanced proctoring features

---

Built with ❤️ for modern education 