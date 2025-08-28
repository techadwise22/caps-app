-- Migration: Update courses and users tables for new management features
-- Date: 2024-01-15

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS content_youtube_links CASCADE;
DROP TABLE IF EXISTS content_items CASCADE;
DROP TABLE IF EXISTS course_youtube_links CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- Update users table to add level and status fields
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS level TEXT CHECK (level IN ('Foundation', 'Intermediate', 'Final')),
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('active', 'pending')) DEFAULT 'active';

-- Create new courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    level TEXT CHECK (level IN ('Foundation', 'Intermediate', 'Final')),
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    students_count INTEGER DEFAULT 0,
    instructors_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create course YouTube links table
CREATE TABLE course_youtube_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content items table
CREATE TABLE content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    content_type TEXT CHECK (content_type IN ('study_material', 'video_series', 'practice_questions', 'lecture_notes', 'case_study')),
    level TEXT CHECK (level IN ('Foundation', 'Intermediate', 'Final')),
    status TEXT CHECK (status IN ('published', 'pending_review', 'draft')) DEFAULT 'pending_review',
    views_count INTEGER DEFAULT 0,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create content YouTube links table
CREATE TABLE content_youtube_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_level ON users(level);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_created_by ON courses(created_by);
CREATE INDEX IF NOT EXISTS idx_course_youtube_links_course ON course_youtube_links(course_id);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(content_type);
CREATE INDEX IF NOT EXISTS idx_content_items_level ON content_items(level);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_author ON content_items(author_id);
CREATE INDEX IF NOT EXISTS idx_content_items_course ON content_items(course_id);
CREATE INDEX IF NOT EXISTS idx_content_youtube_links_content ON content_youtube_links(content_id);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_youtube_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_youtube_links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can view all courses" ON courses FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all courses" ON courses FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can view all course YouTube links" ON course_youtube_links FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all course YouTube links" ON course_youtube_links FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Content items policies
CREATE POLICY "Admins can view all content items" ON content_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all content items" ON content_items FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Content YouTube links policies
CREATE POLICY "Admins can view all content YouTube links" ON content_youtube_links FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all content YouTube links" ON content_youtube_links FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Create triggers
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_youtube_links_updated_at BEFORE UPDATE ON course_youtube_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_youtube_links_updated_at BEFORE UPDATE ON content_youtube_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo data
INSERT INTO users (id, email, full_name, role, level, status, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'demo@capslearn.com', 'Demo User', 'committee_tester', 'Foundation', 'active', true),
('550e8400-e29b-41d4-a716-446655440001', 'admin@capslearn.com', 'Admin User', 'admin', 'Final', 'active', true),
('550e8400-e29b-41d4-a716-446655440002', 'instructor@capslearn.com', 'Instructor User', 'instructor', 'Intermediate', 'active', true),
('550e8400-e29b-41d4-a716-446655440003', 'student@capslearn.com', 'Student User', 'student', 'Foundation', 'active', true)
ON CONFLICT (id) DO UPDATE SET
    level = EXCLUDED.level,
    status = EXCLUDED.status;

-- Insert demo courses
INSERT INTO courses (id, name, description, level, status, students_count, instructors_count, created_by) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'CA Foundation', 'Chartered Accountancy Foundation Course - Comprehensive introduction to accounting principles and business fundamentals', 'Foundation', 'active', 450, 8, '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440011', 'CA Intermediate', 'Chartered Accountancy Intermediate Course - Advanced accounting techniques and professional standards', 'Intermediate', 'active', 320, 12, '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440012', 'CA Final', 'Chartered Accountancy Final Course - Professional practice and advanced topics', 'Final', 'active', 280, 15, '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    level = EXCLUDED.level,
    status = EXCLUDED.status,
    students_count = EXCLUDED.students_count,
    instructors_count = EXCLUDED.instructors_count;

-- Insert demo YouTube links
INSERT INTO course_youtube_links (course_id, title, url, description, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Introduction to Accounting', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Basic accounting concepts and principles', 1),
('550e8400-e29b-41d4-a716-446655440010', 'Business Mathematics', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Mathematical foundations for business', 2),
('550e8400-e29b-41d4-a716-446655440011', 'Advanced Financial Reporting', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Complex financial reporting standards', 1)
ON CONFLICT DO NOTHING;

-- Insert demo content items
INSERT INTO content_items (id, title, subtitle, description, content_type, level, status, views_count, author_id, course_id, created_by) VALUES
('550e8400-e29b-41d4-a716-446655440020', 'CA Foundation - Accounting Basics', 'Accounting', 'Comprehensive study material covering fundamental accounting principles, double-entry bookkeeping, and financial statement preparation for CA Foundation students.', 'study_material', 'Foundation', 'published', 1250, '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440021', 'CA Intermediate - Advanced Accounting Video Series', 'Advanced Accounting', 'Complete video series covering advanced accounting topics including consolidation, foreign exchange, and complex financial instruments.', 'video_series', 'Intermediate', 'published', 890, '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440022', 'CA Final - Strategic Financial Management Notes', 'Strategic Financial Management', 'Comprehensive study notes covering strategic financial management concepts, risk assessment, and investment decision-making.', 'study_material', 'Final', 'pending_review', 0, '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440023', 'CA Foundation - Business Laws Practice Questions', 'Business Laws', 'Extensive collection of practice questions covering business laws, company law, and legal frameworks for CA Foundation examination.', 'practice_questions', 'Foundation', 'published', 2100, '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    content_type = EXCLUDED.content_type,
    level = EXCLUDED.level,
    status = EXCLUDED.status,
    views_count = EXCLUDED.views_count;

-- Insert demo content YouTube links
INSERT INTO content_youtube_links (content_id, title, url, description, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440020', 'Accounting Fundamentals', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Introduction to basic accounting concepts', 1),
('550e8400-e29b-41d4-a716-446655440020', 'Double Entry Bookkeeping', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Understanding double entry system', 2),
('550e8400-e29b-41d4-a716-446655440021', 'Advanced Accounting Part 1', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Consolidation techniques', 1),
('550e8400-e29b-41d4-a716-446655440021', 'Advanced Accounting Part 2', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Foreign exchange accounting', 2),
('550e8400-e29b-41d4-a716-446655440023', 'Business Laws Overview', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Introduction to business laws', 1)
ON CONFLICT DO NOTHING; 