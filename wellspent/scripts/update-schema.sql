-- Add context column to assessment_responses if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'assessment_responses' 
        AND column_name = 'context'
    ) THEN
        ALTER TABLE assessment_responses 
        ADD COLUMN context TEXT NOT NULL DEFAULT 'personal' 
        CHECK (context IN ('personal', 'work'));
    END IF;
END $$;

-- Update existing responses to have proper context values
-- This assumes that each question_id appears twice in the responses
-- with one for personal and one for work
UPDATE assessment_responses
SET context = 'work'
WHERE id IN (
    SELECT r2.id
    FROM assessment_responses r1
    JOIN assessment_responses r2 ON r1.submission_id = r2.submission_id AND r1.question_id = r2.question_id
    WHERE r1.id < r2.id
);

-- Verify the schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'assessment_responses';

-- Count responses by context
SELECT context, COUNT(*) 
FROM assessment_responses 
GROUP BY context; 