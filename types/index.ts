// User and Authentication Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
}

export type UserRole = 'admin' | 'instructor' | 'student' | 'committee_tester';

// Course and Cohort Types
export interface Course {
  id: string;
  name: string;
  description: string;
  code: string;
  instructor_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Cohort {
  id: string;
  name: string;
  description: string;
  course_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CohortMember {
  id: string;
  cohort_id: string;
  user_id: string;
  joined_at: string;
}

// Test and Question Types
export interface Test {
  id: string;
  title: string;
  description: string;
  course_id: string;
  duration_minutes: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  has_negative_marking: boolean;
  negative_marking_percentage: number;
  shuffle_options: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TestSection {
  id: string;
  test_id: string;
  name: string;
  description: string;
  order_index: number;
  time_limit_minutes?: number;
  created_at: string;
}

export interface Question {
  id: string;
  section_id: string;
  question_text: string;
  question_type: QuestionType;
  marks: number;
  order_index: number;
  tags: string[];
  difficulty: QuestionDifficulty;
  created_at: string;
  updated_at: string;
}

export type QuestionType = 'single_choice' | 'multiple_choice' | 'numeric' | 'subjective';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface QuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
}

// Test Attempt and Response Types
export interface TestAttempt {
  id: string;
  test_id: string;
  user_id: string;
  started_at: string;
  submitted_at?: string;
  status: TestAttemptStatus;
  total_score?: number;
  max_score?: number;
  time_taken_minutes?: number;
}

export type TestAttemptStatus = 'in_progress' | 'submitted' | 'timeout' | 'abandoned';

export interface TestResponse {
  id: string;
  attempt_id: string;
  question_id: string;
  response_text?: string;
  selected_options?: string[];
  numeric_answer?: number;
  marks_obtained?: number;
  is_correct?: boolean;
  answered_at: string;
  marked_for_review: boolean;
}

// Content Library Types
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  course_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  tags: string[];
}

export type ContentType = 'youtube_playlist' | 'youtube_video' | 'file' | 'page' | 'mcq_set';

export interface YouTubePlaylist extends ContentItem {
  type: 'youtube_playlist';
  playlist_url: string;
  video_count: number;
  thumbnail_url?: string;
}

export interface YouTubeVideo extends ContentItem {
  type: 'youtube_video';
  video_url: string;
  duration_seconds: number;
  thumbnail_url?: string;
}

export interface FileContent extends ContentItem {
  type: 'file';
  file_url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  file_type: FileType;
}

export type FileType = 'pdf' | 'ppt' | 'doc' | 'image' | 'audio' | 'video' | 'other';

export interface ContentPage extends ContentItem {
  type: 'page';
  content_blocks: ContentBlock[];
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'video' | 'file' | 'mcq' | 'image';
  content: any;
  order_index: number;
}

export interface MCQSet extends ContentItem {
  type: 'mcq_set';
  questions: Question[];
}

// Content Progress Types
export interface ContentProgress {
  id: string;
  user_id: string;
  content_id: string;
  progress_percentage: number;
  time_spent_seconds: number;
  completed_at?: string;
  last_accessed: string;
}

export interface VideoProgress {
  id: string;
  user_id: string;
  video_id: string;
  watched_seconds: number;
  total_seconds: number;
  completed: boolean;
  last_position: number;
  updated_at: string;
}

// Class and Session Types
export interface ClassSession {
  id: string;
  title: string;
  description: string;
  course_id: string;
  instructor_id: string;
  start_time: string;
  end_time: string;
  meeting_link?: string;
  zoom_meeting_id?: string;
  zoom_join_url?: string;
  recording_url?: string;
  status: SessionStatus;
  created_at: string;
  updated_at: string;
}

export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

// Assignment Types
export interface TestAssignment {
  id: string;
  test_id: string;
  cohort_id?: string;
  user_id?: string;
  start_time: string;
  end_time: string;
  max_attempts: number;
  created_by: string;
  created_at: string;
}

// Analytics Types
export interface TestAnalytics {
  test_id: string;
  total_attempts: number;
  average_score: number;
  completion_rate: number;
  average_time_taken: number;
  question_analytics: QuestionAnalytics[];
}

export interface QuestionAnalytics {
  question_id: string;
  correct_answers: number;
  total_attempts: number;
  difficulty_score: number;
  average_time_spent: number;
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  course_id?: string;
  cohort_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Zoom Integration Types
export interface ZoomMeeting {
  id: string;
  meeting_id: string;
  topic: string;
  start_time: string;
  duration: number;
  join_url: string;
  password?: string;
  host_email: string;
  status: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
}

export interface TestForm {
  title: string;
  description: string;
  course_id: string;
  duration_minutes: number;
  start_time: string;
  end_time: string;
  has_negative_marking: boolean;
  negative_marking_percentage: number;
  shuffle_options: boolean;
}

// UI State Types
export interface TestPlayerState {
  currentQuestionIndex: number;
  currentSectionIndex: number;
  answers: Record<string, any>;
  markedForReview: Set<string>;
  timeRemaining: number;
  isSubmitted: boolean;
  lastSaved: string;
}

export interface ContentPlayerState {
  currentBlockIndex: number;
  progress: number;
  timeSpent: number;
  isCompleted: boolean;
} 