// Script to fetch the current schema from Supabase by directly querying tables
// Run with: node scripts/get-schema-direct.js

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
    // Try to get schema for assessment_questions
    console.log('\nChecking assessment_questions table:');
    const { data: questions, error: questionsError } = await supabase
      .from('assessment_questions')
      .select('*')
      .limit(1);
    
    if (questionsError) {
      console.error('Error fetching assessment_questions:', questionsError);
    } else if (questions && questions.length > 0) {
      console.log('assessment_questions columns:', Object.keys(questions[0]));
      
      // Check if component_type and component_config exist
      const hasComponentType = 'component_type' in questions[0];
      const hasComponentConfig = 'component_config' in questions[0];
      
      console.log('Has component_type:', hasComponentType);
      console.log('Has component_config:', hasComponentConfig);
    } else {
      console.log('assessment_questions table exists but has no data');
    }
    
    // Try to get schema for assessment_responses
    console.log('\nChecking assessment_responses table:');
    const { data: responses, error: responsesError } = await supabase
      .from('assessment_responses')
      .select('*')
      .limit(1);
    
    if (responsesError) {
      console.error('Error fetching assessment_responses:', responsesError);
    } else if (responses && responses.length > 0) {
      console.log('assessment_responses columns:', Object.keys(responses[0]));
    } else {
      console.log('assessment_responses table exists but has no data');
    }
    
    // Try to get schema for assessment_response (singular)
    console.log('\nChecking assessment_response table:');
    const { data: response, error: responseError } = await supabase
      .from('assessment_response')
      .select('*')
      .limit(1);
    
    if (responseError) {
      console.error('Error fetching assessment_response:', responseError);
      console.log('assessment_response table likely does not exist');
    } else if (response && response.length > 0) {
      console.log('assessment_response columns:', Object.keys(response[0]));
    } else {
      console.log('assessment_response table exists but has no data');
    }
    
    // Try to get the table structure using a different approach
    console.log('\nAttempting to get table structure using SQL query:');
    const { data: tableInfo, error: tableError } = await supabase
      .from('assessment_questions')
      .select('component_type, component_config')
      .limit(0);
    
    if (tableError) {
      console.error('Error with SQL query:', tableError);
    } else {
      console.log('Table structure from query:', tableInfo);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

getSchema(); 