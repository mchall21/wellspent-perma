import { createClient } from '@supabase/supabase-js';
import { Database } from './database-types';

// Check if environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file or Vercel environment variables.');
  
  // In development, throw an error to make it obvious
  if (process.env.NODE_ENV === 'development') {
    throw new Error('Missing required Supabase environment variables');
  }
}

// Create the Supabase client with proper typing
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
); 