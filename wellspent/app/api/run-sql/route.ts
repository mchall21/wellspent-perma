import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json({
        success: false,
        error: "No query provided",
      }, { status: 400 });
    }
    
    // Create a direct Supabase client with service role key for admin access
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Execute the query
    const { data, error } = await supabaseAdmin.rpc('run_sql', { sql_query: query });
    
    return NextResponse.json({
      success: !error,
      data,
      error,
      query,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in run-sql route:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 