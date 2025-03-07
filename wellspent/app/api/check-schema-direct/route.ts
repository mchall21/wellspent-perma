import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface TableColumn {
  attname: string;
  data_type: string;
  attnotnull: boolean;
}

interface TableInfo {
  columns: TableColumn[];
  columnsError: any;
  sample: any[];
  sampleError: any;
}

interface TableInfoMap {
  [tableName: string]: TableInfo;
}

export async function GET() {
  try {
    // Create a Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // Execute a SQL query to get all tables
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('pg_catalog.pg_tables')
      .select('schemaname, tablename')
      .eq('schemaname', 'public');

    // Get information about each table
    const tableInfo: TableInfoMap = {};
    
    if (tables && !tablesError) {
      for (const table of tables) {
        const tableName = table.tablename;
        
        // Get columns for this table
        const { data: columns, error: columnsError } = await supabaseAdmin
          .from('pg_catalog.pg_attribute')
          .select(`
            attname,
            format_type(atttypid, atttypmod) as data_type,
            attnotnull
          `)
          .eq('attrelid', `public.${tableName}::regclass`)
          .gt('attnum', 0)
          .eq('attisdropped', false);
        
        // Get sample data
        const { data: sampleData, error: sampleError } = await supabaseAdmin
          .from(tableName)
          .select('*')
          .limit(3);
        
        tableInfo[tableName] = {
          columns: columns || [],
          columnsError: columnsError,
          sample: sampleData || [],
          sampleError: sampleError
        };
      }
    }

    return NextResponse.json({
      tables: tables || [],
      tablesError: tablesError,
      tableInfo: tableInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking schema directly:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 