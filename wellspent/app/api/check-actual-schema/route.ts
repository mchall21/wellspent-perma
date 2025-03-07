import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Function to check if a table exists and get sample data
    async function checkTable(tableName: string) {
      // Check if table exists by trying to select from it
      const { data: sampleData, error: tableError } = await supabase
        .from(tableName)
        .select('*')
        .limit(3);
      
      return {
        exists: tableError === null,
        error: tableError,
        sample: sampleData
      };
    }
    
    // Check each table
    const assessmentSubmissions = await checkTable('assessment_submissions');
    const assessmentResponse = await checkTable('assessment_response');
    const assessmentResponses = await checkTable('assessment_responses');
    const assessmentQuestions = await checkTable('assessment_questions');
    const assessmentResults = await checkTable('assessment_results');
    const teams = await checkTable('teams');
    const teamMembers = await checkTable('team_members');
    
    // Get all tables in the database
    const { data: allTables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    return NextResponse.json({
      all_tables: allTables,
      tables_error: tablesError,
      assessment_submissions: assessmentSubmissions,
      assessment_response: assessmentResponse,
      assessment_responses: assessmentResponses,
      assessment_questions: assessmentQuestions,
      assessment_results: assessmentResults,
      teams: teams,
      team_members: teamMembers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking schema:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 