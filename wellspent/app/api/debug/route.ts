import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database-types';

export async function GET() {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {}, // Server actions can't set cookies
        remove() {}, // Server actions can't remove cookies
      },
    }
  );

  // Query the information_schema to get column details
  const { data: columnInfo, error: columnError } = await supabase
    .from('information_schema.columns')
    .select('column_name, data_type, is_nullable')
    .eq('table_name', 'assessment_responses')
    .eq('table_schema', 'public');

  // Get a sample row to understand the structure
  const { data: sampleData, error: sampleError } = await supabase
    .from('assessment_responses')
    .select('*')
    .limit(1);

  return NextResponse.json({
    columns: columnInfo,
    column_error: columnError,
    sample: sampleData,
    sample_error: sampleError,
    timestamp: new Date().toISOString(),
  });
} 