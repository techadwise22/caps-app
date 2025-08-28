import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lteaupjgbmagtwhxtpym.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZWF1cGpnYm1hZ3R3aHh0cHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNjMzOTUsImV4cCI6MjA3MTkzOTM5NX0.hxpQgzdn2slX7gd0_cCUfslTMQQylW-6nmp6VfEWNPw';

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client component client
export const createClientSupabaseClient = () => createClientComponentClient();

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: string;
          course_id: string | null;
          cohort_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          role: string;
          course_id?: string | null;
          cohort_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: string;
          course_id?: string | null;
          cohort_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tests: {
        Row: {
          id: string;
          title: string;
          description: string | null;
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
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          course_id: string;
          duration_minutes: number;
          start_time: string;
          end_time: string;
          is_active?: boolean;
          has_negative_marking?: boolean;
          negative_marking_percentage?: number;
          shuffle_options?: boolean;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          course_id?: string;
          duration_minutes?: number;
          start_time?: string;
          end_time?: string;
          is_active?: boolean;
          has_negative_marking?: boolean;
          negative_marking_percentage?: number;
          shuffle_options?: boolean;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

// Typed Supabase client
export const createTypedSupabaseClient = () => createClient<Database>(supabaseUrl, supabaseAnonKey); 