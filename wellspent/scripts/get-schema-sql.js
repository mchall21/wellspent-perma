// Script to fetch the current schema from Supabase using SQL
// Run with: node scripts/get-schema-sql.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure .env.local is set up correctly.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getSchema() {
  try {
    // Get list of tables in the public schema
    const { data: tables, error: tablesError } = await supabase.rpc('get_tables');
    
    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      return;
    }
    
    console.log('Tables in public schema:');
    console.log(tables);
    
    // Get specific table schema for assessment_questions
    console.log('\nSchema for assessment_questions:');
    const { data: questionsSchema, error: questionsError } = await supabase
      .from('assessment_questions')
      .select('*')
      .limit(1);
    
    if (questionsError) {
      console.error('Error fetching assessment_questions schema:', questionsError);
    } else {
      console.log(Object.keys(questionsSchema[0]));
    }
    
    // Get specific table schema for assessment_responses
    console.log('\nSchema for assessment_responses:');
    const { data: responsesSchema, error: responsesError } = await supabase
      .from('assessment_responses')
      .select('*')
      .limit(1);
    
    if (responsesError) {
      console.error('Error fetching assessment_responses schema:', responsesError);
    } else {
      console.log(Object.keys(responsesSchema[0]));
    }
    
    // Try to get schema for assessment_response (singular)
    console.log('\nSchema for assessment_response (singular):');
    const { data: responseSchema, error: responseError } = await supabase
      .from('assessment_response')
      .select('*')
      .limit(1);
    
    if (responseError) {
      console.error('Error fetching assessment_response schema:', responseError);
    } else {
      console.log(Object.keys(responseSchema[0]));
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

getSchema(); 