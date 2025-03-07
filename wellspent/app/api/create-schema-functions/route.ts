import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Create a Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // Create the function to get table columns
    const { data: createFunctionData, error: createFunctionError } = await supabaseAdmin.rpc(
      'create_get_columns_function'
    ).catch(() => {
      return { data: null, error: { message: 'Function already exists or failed to create' } };
    });

    if (createFunctionError) {
      // Try creating the function using raw SQL
      const { data: sqlData, error: sqlError } = await supabaseAdmin.rpc(
        'exec_sql',
        {
          sql: `
            CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
            RETURNS TABLE (
              column_name text,
              data_type text,
              is_nullable boolean
            )
            LANGUAGE plpgsql
            SECURITY DEFINER
            AS $$
            BEGIN
              RETURN QUERY
              SELECT 
                c.column_name::text,
                c.data_type::text,
                (c.is_nullable = 'YES')::boolean
              FROM 
                information_schema.columns c
              WHERE 
                c.table_schema = 'public'
                AND c.table_name = table_name;
            END;
            $$;
          `
        }
      ).catch(() => {
        return { data: null, error: { message: 'Failed to create function using exec_sql' } };
      });

      if (sqlError) {
        // Try one more approach - direct SQL query
        const { data: directData, error: directError } = await supabaseAdmin.from('_exec_sql').select('*').eq('sql', `
          CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
          RETURNS TABLE (
            column_name text,
            data_type text,
            is_nullable boolean
          )
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          BEGIN
            RETURN QUERY
            SELECT 
              c.column_name::text,
              c.data_type::text,
              (c.is_nullable = 'YES')::boolean
            FROM 
              information_schema.columns c
            WHERE 
              c.table_schema = 'public'
              AND c.table_name = table_name;
          END;
          $$;
        `);

        return NextResponse.json({
          message: 'Attempted to create function using direct SQL',
          createFunctionError,
          sqlError,
          directResult: { data: directData, error: directError },
          timestamp: new Date().toISOString()
        });
      }

      return NextResponse.json({
        message: 'Created function using exec_sql',
        createFunctionError,
        sqlResult: { data: sqlData, error: sqlError },
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      message: 'Created function successfully',
      result: createFunctionData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating schema functions:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 