-- Create or update the assessment_responses table with the correct structure
DO $$
BEGIN
    -- Check if the table exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'assessment_responses' 
        AND table_schema = 'public'
    ) THEN
        -- Create the table if it doesn't exist
        CREATE TABLE public.assessment_responses (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            submission_id uuid REFERENCES public.assessment_submissions(id) NOT NULL,
            question_id uuid REFERENCES public.assessment_questions(id) NOT NULL,
            personal_response_value integer CHECK (personal_response_value >= 0 AND personal_response_value <= 10),
            work_response_value integer CHECK (work_response_value >= 0 AND work_response_value <= 10)
        );
        
        -- Set up Row Level Security (RLS)
        ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;
        
        -- Policies
        CREATE POLICY "Users can view their own responses"
          ON public.assessment_responses FOR SELECT
          USING (EXISTS (
            SELECT 1 FROM public.assessment_submissions
            WHERE id = assessment_responses.submission_id
            AND user_id = auth.uid()
          ));
        
        CREATE POLICY "Users can create their own responses"
          ON public.assessment_responses FOR INSERT
          WITH CHECK (EXISTS (
            SELECT 1 FROM public.assessment_submissions
            WHERE id = assessment_responses.submission_id
            AND user_id = auth.uid()
          ));
        
        CREATE POLICY "Coaches can view team member responses"
          ON public.assessment_responses FOR SELECT
          USING (EXISTS (
            SELECT 1 FROM public.assessment_submissions s
            JOIN public.team_members tm ON s.team_id = tm.team_id
            WHERE s.id = assessment_responses.submission_id
            AND tm.user_id = auth.uid()
            AND tm.role = 'coach'
          ));
        
        RAISE NOTICE 'Created assessment_responses table with RLS policies';
    ELSE
        -- Check if personal_response_value column exists
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'assessment_responses' 
            AND column_name = 'personal_response_value'
        ) THEN
            ALTER TABLE public.assessment_responses 
            ADD COLUMN personal_response_value integer CHECK (personal_response_value >= 0 AND personal_response_value <= 10);
            
            RAISE NOTICE 'Added personal_response_value column';
        END IF;
        
        -- Check if work_response_value column exists
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'assessment_responses' 
            AND column_name = 'work_response_value'
        ) THEN
            ALTER TABLE public.assessment_responses 
            ADD COLUMN work_response_value integer CHECK (work_response_value >= 0 AND work_response_value <= 10);
            
            RAISE NOTICE 'Added work_response_value column';
        END IF;
    END IF;
END $$; 