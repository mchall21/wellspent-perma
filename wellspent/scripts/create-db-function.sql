-- Create a function to get assessment questions without RLS issues
CREATE OR REPLACE FUNCTION public.get_assessment_questions()
RETURNS SETOF assessment_questions
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM assessment_questions ORDER BY question_order;
$$;

-- Grant execute permission to the anon role
GRANT EXECUTE ON FUNCTION public.get_assessment_questions() TO anon;
GRANT EXECUTE ON FUNCTION public.get_assessment_questions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_assessment_questions() TO service_role; 