-- Database schema for WellSpent PERMA-V Assessment Tool

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Assessment Questions Table
CREATE TABLE IF NOT EXISTS assessment_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    category VARCHAR(10) NOT NULL,
    personal_context_label TEXT NOT NULL,
    work_context_label TEXT NOT NULL,
    scale_start INTEGER NOT NULL,
    scale_end INTEGER NOT NULL,
    scale_start_label TEXT NOT NULL,
    scale_end_label TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

-- Assessment Submissions Table
CREATE TABLE IF NOT EXISTS assessment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Assessment Response Table (combined personal and work scores)
CREATE TABLE IF NOT EXISTS assessment_response (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES assessment_submissions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES assessment_questions(id),
    personal_response_value INTEGER NOT NULL,
    work_response_value INTEGER NOT NULL,
    UNIQUE(submission_id, question_id)
);

-- Assessment Responses Table (separate personal and work records)
CREATE TABLE IF NOT EXISTS assessment_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_id UUID NOT NULL REFERENCES assessment_submissions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES assessment_questions(id),
    score INTEGER NOT NULL,
    context VARCHAR(10) NOT NULL CHECK (context IN ('personal', 'work')),
    UNIQUE(submission_id, question_id, context)
);

-- Assessment Results Table (pre-calculated dimension scores)
CREATE TABLE IF NOT EXISTS assessment_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_id UUID NOT NULL REFERENCES assessment_submissions(id) ON DELETE CASCADE,
    dimension VARCHAR(10) NOT NULL,
    personal_score NUMERIC(5,2) NOT NULL,
    work_score NUMERIC(5,2) NOT NULL,
    UNIQUE(submission_id, dimension)
);

-- Teams Table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    role VARCHAR(20) NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessment_response_submission_id ON assessment_response(submission_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_submission_id ON assessment_responses(submission_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_submission_id ON assessment_results(submission_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id); 