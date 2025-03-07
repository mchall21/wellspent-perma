// Script to fetch the current schema from Supabase using the service role key
// Run with: node scripts/get-schema-service.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Make sure .env.local is set up correctly.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getSchema() {
  try {
    // Get schema information using the service role key
    console.log('Fetching schema information using service role key...');
    
    // Query to get all tables in the public schema
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_schema_info', { schema_name: 'public' })
      .catch(async () => {
        // If RPC fails, try a direct SQL query
        console.log('RPC failed, trying direct SQL query...');
        return await supabase.from('pg_tables')
          .select('*')
          .eq('schemaname', 'public');
      });
    
    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      return;
    }
    
    console.log('Tables in public schema:');
    console.log(tables);
    
    // Check assessment_questions table
    console.log('\nChecking assessment_questions table structure:');
    const { data: questionsColumns, error: questionsError } = await supabase
      .from('assessment_questions')
      .select()
      .limit(1);
    
    if (questionsError) {
      console.error('Error fetching assessment_questions:', questionsError);
    } else if (questionsColumns && questionsColumns.length > 0) {
      console.log('assessment_questions columns:', Object.keys(questionsColumns[0]));
      
      // Check if component_type and component_config exist
      const hasComponentType = 'component_type' in questionsColumns[0];
      const hasComponentConfig = 'component_config' in questionsColumns[0];
      
      console.log('Has component_type:', hasComponentType);
      console.log('Has component_config:', hasComponentConfig);
    } else {
      console.log('assessment_questions table exists but has no data');
    }
    
    // Check assessment_responses table
    console.log('\nChecking assessment_responses table structure:');
    const { data: responsesColumns, error: responsesError } = await supabase
      .from('assessment_responses')
      .select()
      .limit(1);
    
    if (responsesError) {
      console.error('Error fetching assessment_responses:', responsesError);
    } else if (responsesColumns && responsesColumns.length > 0) {
      console.log('assessment_responses columns:', Object.keys(responsesColumns[0]));
    } else {
      console.log('assessment_responses table exists but has no data');
      
      // Try to execute a SQL query to get the table structure
      const { data: tableInfo, error: tableError } = await supabase
        .rpc('get_table_definition', { table_name: 'assessment_responses' })
        .catch(async () => {
          console.log('RPC failed, trying direct SQL query...');
          return await supabase.from('information_schema.columns')
            .select('column_name, data_type')
            .eq('table_schema', 'public')
            .eq('table_name', 'assessment_responses');
        });
      
      if (tableError) {
        console.error('Error fetching table definition:', tableError);
      } else {
        console.log('Table definition:', tableInfo);
      }
    }
    
    // Check assessment_response table (singular)
    console.log('\nChecking assessment_response table structure:');
    const { data: responseColumns, error: responseError } = await supabase
      .from('assessment_response')
      .select()
      .limit(1);
    
    if (responseError) {
      console.error('Error fetching assessment_response:', responseError);
      console.log('assessment_response table likely does not exist');
      
      // Try to check if the table exists
      const { data: tableExists, error: existsError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'assessment_response');
      
      if (existsError) {
        console.error('Error checking if table exists:', existsError);
      } else {
        console.log('Table exists check:', tableExists);
      }
    } else if (responseColumns && responseColumns.length > 0) {
      console.log('assessment_response columns:', Object.keys(responseColumns[0]));
    } else {
      console.log('assessment_response table exists but has no data');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

getSchema(); 