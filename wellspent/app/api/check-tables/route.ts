import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface TableResult {
  exists: boolean;
  error: string | null;
  sample: any[] | null;
  count: number;
}

interface TableResults {
  [tableName: string]: TableResult;
}

export async function GET() {
  try {
    // List of tables to check
    const tablesToCheck = [
      'assessment_questions',
      'assessment_submissions',
      'assessment_response',
      'assessment_responses',
      'assessment_results',
      'teams',
      'team_members'
    ];
    
    // Check each table and get sample data
    const results: TableResults = {};
    
    for (const tableName of tablesToCheck) {
      // Try to select data from the table
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(3);
      
      results[tableName] = {
        exists: error === null,
        error: error ? error.message : null,
        sample: data,
        count: data ? data.length : 0
      };
    }
    
    return NextResponse.json({
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking tables:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 