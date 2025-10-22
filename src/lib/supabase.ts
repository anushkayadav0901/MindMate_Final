import { createClient } from '@supabase/supabase-js';

// Get environment variables with better error messages
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Development-friendly error handling
if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.DEV) {
    console.warn(`
⚠️  Missing Supabase environment variables!
Please create a .env file with:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

You can find these in your Supabase project settings -> API.
    `);
  } else {
    throw new Error('Missing Supabase environment variables');
  }
}

// Create Supabase client with error handling
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Test connection (optional - for debugging)
export const testSupabaseConnection = async () => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Not configured' };
  }
  
  try {
    const { data, error } = await supabase.from('mood_logs').select('count').limit(1);
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};

// Type definitions
export type MoodLog = {
  id: string;
  user_id: string;
  mood: string;
  emotion_scores: Record<string, number>;
  activity: string;
  timestamp: string;
};

export type LearningSession = {
  id: string;
  user_id: string;
  pdf_name: string;
  summary: string | null;
  duration_minutes: number;
  wellness_points_earned: number;
  completed: boolean;
  created_at: string;
};

export type RelaxationSession = {
  id: string;
  user_id: string;
  session_type: string;
  duration_seconds: number;
  initial_mood: string | null;
  final_mood: string | null;
  created_at: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  wellness_points: number;
  created_at: string;
  updated_at: string;
};