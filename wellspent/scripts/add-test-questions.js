// This script adds test questions for all PERMA-V dimensions
// Run with: node scripts/add-test-questions.js

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

const testQuestions = [
  {
    id: uuidv4(),
    text: "How often do you experience positive emotions?",
    category: "P", // Positive Emotion
    personal_context_label: "In your personal life",
    work_context_label: "At work",
    scale_start: 0,
    scale_end: 10,
    scale_start_label: "Never",
    scale_end_label: "Always",
    question_order: 1,
    active: true
  },
  {
    id: uuidv4(),
    text: "How engaged are you in activities that challenge you?",
    category: "E", // Engagement
    personal_context_label: "In your personal life",
    work_context_label: "At work",
    scale_start: 0,
    scale_end: 10,
    scale_start_label: "Not at all",
    scale_end_label: "Completely",
    question_order: 2,
    active: true
  },
  {
    id: uuidv4(),
    text: "How satisfied are you with your relationships?",
    category: "R", // Relationships
    personal_context_label: "In your personal life",
    work_context_label: "At work",
    scale_start: 0,
    scale_end: 10,
    scale_start_label: "Not satisfied",
    scale_end_label: "Very satisfied",
    question_order: 3,
    active: true
  },
  {
    id: uuidv4(),
    text: "How meaningful do you find your activities?",
    category: "M", // Meaning
    personal_context_label: "In your personal life",
    work_context_label: "At work",
    scale_start: 0,
    scale_end: 10,
    scale_start_label: "Not meaningful",
    scale_end_label: "Very meaningful",
    question_order: 4,
    active: true
  },
  {
    id: uuidv4(),
    text: "How often do you feel a sense of accomplishment?",
    category: "A", // Accomplishment
    personal_context_label: "In your personal life",
    work_context_label: "At work",
    scale_start: 0,
    scale_end: 10,
    scale_start_label: "Never",
    scale_end_label: "Always",
    question_order: 5,
    active: true
  },
  {
    id: uuidv4(),
    text: "How would you rate your physical and mental health?",
    category: "V", // Vitality
    personal_context_label: "In your personal life",
    work_context_label: "At work",
    scale_start: 0,
    scale_end: 10,
    scale_start_label: "Poor",
    scale_end_label: "Excellent",
    question_order: 6,
    active: true
  }
];

async function addTestQuestions() {
  console.log(`Adding ${testQuestions.length} test questions...`);

  for (const question of testQuestions) {
    console.log(`Adding question: ${question.text} (${question.category})`);
    
    const { data, error } = await supabase
      .from('assessment_questions')
      .insert(question)
      .select();

    if (error) {
      console.error(`Error adding question: ${question.text}`, error);
    } else {
      console.log(`Successfully added question: ${question.text}`);
    }
  }

  console.log('Finished adding test questions');
}

addTestQuestions()
  .catch(console.error)
  .finally(() => process.exit(0)); 