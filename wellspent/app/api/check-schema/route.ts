import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Check the schema of assessment_responses table
    const { data: responseColumns, error: responseError } = await supabase
      .from('information_schema.columns')
      .select('*')
      .eq('table_name', 'assessment_responses');
    
    // Check the schema of assessment_submissions table
    const { data: submissionColumns, error: submissionError } = await supabase
      .from('information_schema.columns')
      .select('*')
      .eq('table_name', 'assessment_submissions');
    
    // Try to get a sample response
    const { data: sampleResponse, error: sampleError } = await supabase
      .from('assessment_responses')
      .select('*')
      .limit(1);
    
    // Try to get a sample submission
    const { data: sampleSubmission, error: submissionSampleError } = await supabase
      .from('assessment_submissions')
      .select('*')
      .limit(1);
    
    return NextResponse.json({
      success: true,
      assessment_responses: {
        columns: responseColumns,
        error: responseError,
        sample: sampleResponse
      },
      assessment_submissions: {
        columns: submissionColumns,
        error: submissionError,
        sample: sampleSubmission
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in check-schema route:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 