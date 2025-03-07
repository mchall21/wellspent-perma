// Script to fetch the current schema from Supabase
// Run with: node scripts/get-schema.js

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
    // Query to get table information
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_schema_info', { schema_name: 'public' });

    if (tablesError) {
      console.error('Error fetching schema:', tablesError);
      
      // Try a direct SQL query instead
      console.log('Trying direct SQL query...');
      const { data: tablesSql, error: tablesSqlError } = await supabase
        .from('pg_tables')
        .select('*')
        .eq('schemaname', 'public');
      
      if (tablesSqlError) {
        console.error('Error with direct SQL query:', tablesSqlError);
        return;
      }
      
      console.log('Tables in public schema:');
      console.log(JSON.stringify(tablesSql, null, 2));
      
      // For each table, try to get its columns
      for (const table of tablesSql) {
        const tableName = table.tablename;
        console.log(`\nColumns for table ${tableName}:`);
        
        const { data: columns, error: columnsError } = await supabase
          .from('information_schema.columns')
          .select('*')
          .eq('table_schema', 'public')
          .eq('table_name', tableName);
        
        if (columnsError) {
          console.error(`Error fetching columns for ${tableName}:`, columnsError);
          continue;
        }
        
        console.log(JSON.stringify(columns, null, 2));
      }
      
      return;
    }
    
    console.log('Schema information:');
    console.log(JSON.stringify(tables, null, 2));
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

getSchema(); 