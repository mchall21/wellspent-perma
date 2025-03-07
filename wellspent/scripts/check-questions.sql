-- Check if the assessment_questions table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'assessment_questions'
) AS table_exists;

-- Check the structure of the assessment_questions table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'assessment_questions';

-- Count the number of questions
SELECT COUNT(*) AS question_count
FROM assessment_questions;

-- Sample the first 5 questions
SELECT *
FROM assessment_questions
LIMIT 5; 