// This script adds a test question to the database
// Run with: node scripts/add-test-question.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// First, let's check the table structure to understand the constraints
async function checkTableStructure() {
  console.log('Checking table structure...');
  
  try {
    // Get all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      return;
    }
    
    console.log('Available tables:', tables.map(t => t.table_name));
    
    // Try to get a sample question to understand the structure
    const { data: sampleQuestions, error: sampleError } = await supabase
      .from('assessment_questions')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.error('Error fetching sample question:', sampleError);
    } else {
      console.log('Sample question:', sampleQuestions);
    }
  } catch (error) {
    console.error('Error checking table structure:', error);
  }
}

async function addTestQuestion() {
  await checkTableStructure();
  
  const testQuestion = {
    id: uuidv4(),
    text: "How often do you experience positive emotions?",
    category: "P", // Using a single letter as it might be an enum or have constraints
    personal_context_label: "In your personal life",
    work_context_label: "At work",
    scale_start: 0,
    scale_end: 10,
    scale_start_label: "Never",
    scale_end_label: "Always",
    question_order: 1,
    active: true
  };

  console.log('Adding test question:', testQuestion);

  const { data, error } = await supabase
    .from('assessment_questions')
    .insert(testQuestion)
    .select();

  if (error) {
    console.error('Error adding test question:', error);
    return;
  }

  console.log('Test question added successfully:', data);
}

addTestQuestion()
  .catch(console.error)
  .finally(() => process.exit(0)); 