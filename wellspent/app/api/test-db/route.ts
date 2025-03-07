import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test the connection by querying a simple table
    const { data: questions, error: questionsError } = await supabase
      .from('assessment_questions')
      .select('*')
      .limit(1);
    
    // Also try to get the current user to test authentication
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    // Check environment variables
    const envVars = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
    
    return NextResponse.json({
      success: true,
      questions,
      questionsError,
      auth: {
        session: authData?.session ? 'Session exists' : 'No session',
        error: authError,
      },
      envVars,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in test-db route:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 