-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'instructor', 'student', 'committee_tester');
CREATE TYPE question_type AS ENUM ('single_choice', 'multiple_choice', 'numeric', 'subjective');
CREATE TYPE question_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE test_attempt_status AS ENUM ('in_progress', 'submitted', 'timeout', 'abandoned');
CREATE TYPE content_type AS ENUM ('youtube_playlist', 'youtube_video', 'file', 'page', 'mcq_set');
CREATE TYPE file_type AS ENUM ('pdf', 'ppt', 'doc', 'image', 'audio', 'video', 'other');
CREATE TYPE session_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    level TEXT CHECK (level IN ('Foundation', 'Intermediate', 'Final')),
    status TEXT CHECK (status IN ('active', 'pending')) DEFAULT 'active',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Courses table
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

-- Course YouTube links table
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

-- Content items table
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

-- Content YouTube links table
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

-- Cohorts table
CREATE TABLE cohorts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Cohort members table
CREATE TABLE cohort_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cohort_id, user_id)
);

-- Tests table
CREATE TABLE tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    duration_minutes INTEGER NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    has_negative_marking BOOLEAN DEFAULT FALSE,
    negative_marking_percentage DECIMAL(5,2) DEFAULT 0,
    shuffle_options BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test sections table
CREATE TABLE test_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    time_limit_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID REFERENCES test_sections(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type question_type NOT NULL,
    marks INTEGER NOT NULL DEFAULT 1,
    order_index INTEGER NOT NULL,
    tags TEXT[] DEFAULT '{}',
    difficulty question_difficulty DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Question options table
CREATE TABLE question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    order_index INTEGER NOT NULL
);

-- Test attempts table
CREATE TABLE test_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    status test_attempt_status DEFAULT 'in_progress',
    total_score DECIMAL(5,2),
    max_score DECIMAL(5,2),
    time_taken_minutes INTEGER,
    UNIQUE(test_id, user_id)
);

-- Test responses table
CREATE TABLE test_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES test_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    response_text TEXT,
    selected_options UUID[],
    numeric_answer DECIMAL(10,2),
    marks_obtained DECIMAL(5,2),
    is_correct BOOLEAN,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    marked_for_review BOOLEAN DEFAULT FALSE
);

-- Content items table
CREATE TABLE content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type content_type NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}'
);

-- Content progress table
CREATE TABLE content_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, content_id)
);

-- Video progress table
CREATE TABLE video_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    video_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    watched_seconds INTEGER DEFAULT 0,
    total_seconds INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    last_position INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, video_id)
);

-- Class sessions table
CREATE TABLE class_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    meeting_link TEXT,
    zoom_meeting_id TEXT,
    zoom_join_url TEXT,
    recording_url TEXT,
    status session_status DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test assignments table
CREATE TABLE test_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    cohort_id UUID REFERENCES cohorts(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    max_attempts INTEGER DEFAULT 1,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (cohort_id IS NOT NULL OR user_id IS NOT NULL)
);

-- Announcements table
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    cohort_id UUID REFERENCES cohorts(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Zoom meetings table
CREATE TABLE zoom_meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id TEXT UNIQUE NOT NULL,
    topic TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL,
    join_url TEXT NOT NULL,
    password TEXT,
    host_email TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_created_by ON courses(created_by);
CREATE INDEX idx_course_youtube_links_course ON course_youtube_links(course_id);
CREATE INDEX idx_content_items_type ON content_items(content_type);
CREATE INDEX idx_content_items_level ON content_items(level);
CREATE INDEX idx_content_items_status ON content_items(status);
CREATE INDEX idx_content_items_author ON content_items(author_id);
CREATE INDEX idx_content_items_course ON content_items(course_id);
CREATE INDEX idx_content_youtube_links_content ON content_youtube_links(content_id);
CREATE INDEX idx_cohorts_course ON cohorts(course_id);
CREATE INDEX idx_cohort_members_cohort ON cohort_members(cohort_id);
CREATE INDEX idx_cohort_members_user ON cohort_members(user_id);
CREATE INDEX idx_tests_course ON tests(course_id);
CREATE INDEX idx_tests_created_by ON tests(created_by);
CREATE INDEX idx_test_sections_test ON test_sections(test_id);
CREATE INDEX idx_questions_section ON questions(section_id);
CREATE INDEX idx_question_options_question ON question_options(question_id);
CREATE INDEX idx_test_attempts_test ON test_attempts(test_id);
CREATE INDEX idx_test_attempts_user ON test_attempts(user_id);
CREATE INDEX idx_test_responses_attempt ON test_responses(attempt_id);
CREATE INDEX idx_test_responses_question ON test_responses(question_id);
CREATE INDEX idx_content_items_course ON content_items(course_id);
CREATE INDEX idx_content_items_created_by ON content_items(created_by);
CREATE INDEX idx_content_progress_user ON content_progress(user_id);
CREATE INDEX idx_content_progress_content ON content_progress(content_id);
CREATE INDEX idx_video_progress_user ON video_progress(user_id);
CREATE INDEX idx_video_progress_video ON video_progress(video_id);
CREATE INDEX idx_class_sessions_course ON class_sessions(course_id);
CREATE INDEX idx_class_sessions_instructor ON class_sessions(instructor_id);
CREATE INDEX idx_test_assignments_test ON test_assignments(test_id);
CREATE INDEX idx_test_assignments_cohort ON test_assignments(cohort_id);
CREATE INDEX idx_test_assignments_user ON test_assignments(user_id);
CREATE INDEX idx_announcements_course ON announcements(course_id);
CREATE INDEX idx_announcements_cohort ON announcements(cohort_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_youtube_links_updated_at BEFORE UPDATE ON course_youtube_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_youtube_links_updated_at BEFORE UPDATE ON content_youtube_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON tests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_youtube_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_youtube_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohort_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE zoom_meetings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any user" ON users FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Courses policies
CREATE POLICY "Admins can view all courses" ON courses FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all courses" ON courses FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Course YouTube links policies
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

-- Tests policies
CREATE POLICY "Users can view tests for their courses" ON tests FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM cohort_members cm
        JOIN cohorts c ON cm.cohort_id = c.id
        WHERE cm.user_id = auth.uid() AND c.course_id = tests.course_id
    ) OR
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Instructors can manage tests for their courses" ON tests FOR ALL USING (
    EXISTS (
        SELECT 1 FROM courses
        WHERE id = tests.course_id AND instructor_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Test attempts policies
CREATE POLICY "Users can view their own test attempts" ON test_attempts FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM tests t
        JOIN courses c ON t.course_id = c.id
        WHERE t.id = test_attempts.test_id AND c.instructor_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can create their own test attempts" ON test_attempts FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own test attempts" ON test_attempts FOR UPDATE USING (user_id = auth.uid());

-- Content items policies
CREATE POLICY "Users can view published content" ON content_items FOR SELECT USING (
    is_published = true OR
    created_by = auth.uid() OR
    EXISTS (
        SELECT 1 FROM courses c
        WHERE c.id = content_items.course_id AND c.instructor_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Instructors can manage content for their courses" ON content_items FOR ALL USING (
    EXISTS (
        SELECT 1 FROM courses c
        WHERE c.id = content_items.course_id AND c.instructor_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Insert demo data
INSERT INTO users (id, email, full_name, role, level, status, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'demo@capslearn.com', 'Demo User', 'committee_tester', 'Foundation', 'active', true),
('550e8400-e29b-41d4-a716-446655440001', 'admin@capslearn.com', 'Admin User', 'admin', 'Final', 'active', true),
('550e8400-e29b-41d4-a716-446655440002', 'instructor@capslearn.com', 'Instructor User', 'instructor', 'Intermediate', 'active', true),
('550e8400-e29b-41d4-a716-446655440003', 'student@capslearn.com', 'Student User', 'student', 'Foundation', 'active', true);

-- Insert demo courses
INSERT INTO courses (id, name, description, level, status, students_count, instructors_count, created_by) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'CA Foundation', 'Chartered Accountancy Foundation Course - Comprehensive introduction to accounting principles and business fundamentals', 'Foundation', 'active', 450, 8, '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440011', 'CA Intermediate', 'Chartered Accountancy Intermediate Course - Advanced accounting techniques and professional standards', 'Intermediate', 'active', 320, 12, '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440012', 'CA Final', 'Chartered Accountancy Final Course - Professional practice and advanced topics', 'Final', 'active', 280, 15, '550e8400-e29b-41d4-a716-446655440001');

-- Insert demo YouTube links
INSERT INTO course_youtube_links (course_id, title, url, description, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Introduction to Accounting', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Basic accounting concepts and principles', 1),
('550e8400-e29b-41d4-a716-446655440010', 'Business Mathematics', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Mathematical foundations for business', 2),
('550e8400-e29b-41d4-a716-446655440011', 'Advanced Financial Reporting', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Complex financial reporting standards', 1);

-- Insert demo content items
INSERT INTO content_items (id, title, subtitle, description, content_type, level, status, views_count, author_id, course_id, created_by) VALUES
('550e8400-e29b-41d4-a716-446655440020', 'CA Foundation - Accounting Basics', 'Accounting', 'Comprehensive study material covering fundamental accounting principles, double-entry bookkeeping, and financial statement preparation for CA Foundation students.', 'study_material', 'Foundation', 'published', 1250, '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440021', 'CA Intermediate - Advanced Accounting Video Series', 'Advanced Accounting', 'Complete video series covering advanced accounting topics including consolidation, foreign exchange, and complex financial instruments.', 'video_series', 'Intermediate', 'published', 890, '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440022', 'CA Final - Strategic Financial Management Notes', 'Strategic Financial Management', 'Comprehensive study notes covering strategic financial management concepts, risk assessment, and investment decision-making.', 'study_material', 'Final', 'pending_review', 0, '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440023', 'CA Foundation - Business Laws Practice Questions', 'Business Laws', 'Extensive collection of practice questions covering business laws, company law, and legal frameworks for CA Foundation examination.', 'practice_questions', 'Foundation', 'published', 2100, '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001');

-- Insert demo content YouTube links
INSERT INTO content_youtube_links (content_id, title, url, description, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440020', 'Accounting Fundamentals', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Introduction to basic accounting concepts', 1),
('550e8400-e29b-41d4-a716-446655440020', 'Double Entry Bookkeeping', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Understanding double entry system', 2),
('550e8400-e29b-41d4-a716-446655440021', 'Advanced Accounting Part 1', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Consolidation techniques', 1),
('550e8400-e29b-41d4-a716-446655440021', 'Advanced Accounting Part 2', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Foreign exchange accounting', 2),
('550e8400-e29b-41d4-a716-446655440023', 'Business Laws Overview', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Introduction to business laws', 1);

-- Insert demo cohort
INSERT INTO cohorts (id, name, description, course_id) VALUES
('550e8400-e29b-41d4-a716-446655440020', 'CS101 Fall 2024', 'Fall 2024 cohort for CS101', '550e8400-e29b-41d4-a716-446655440010');

-- Insert demo cohort member
INSERT INTO cohort_members (cohort_id, user_id) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440003'); 