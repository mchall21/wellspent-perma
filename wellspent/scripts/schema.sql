-- Create user profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'coach', 'admin'))
);

-- Create assessment questions table
CREATE TABLE assessment_questions (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  question_text TEXT NOT NULL,
  dimension TEXT NOT NULL CHECK (dimension IN ('positive_emotion', 'engagement', 'relationships', 'meaning', 'accomplishment', 'vitality')),
  context TEXT NOT NULL CHECK (context IN ('personal', 'work')),
  pair_id INTEGER REFERENCES assessment_questions(id)
);

-- Create assessment submissions table
CREATE TABLE assessment_submissions (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create assessment responses table
CREATE TABLE assessment_responses (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submission_id INTEGER NOT NULL REFERENCES assessment_submissions(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 10),
  context TEXT NOT NULL CHECK (context IN ('personal', 'work'))
);

-- Create reflections table
CREATE TABLE reflections (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submission_id INTEGER NOT NULL REFERENCES assessment_submissions(id) ON DELETE CASCADE,
  priority_dimension TEXT NOT NULL CHECK (priority_dimension IN ('positive_emotion', 'engagement', 'relationships', 'meaning', 'accomplishment', 'vitality')),
  goals TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- Create teams table
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- Create team members table
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'coach', 'admin')),
  UNIQUE (team_id, user_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- User profiles: Users can read all profiles but only update their own
CREATE POLICY "Users can view all profiles" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Assessment questions: Anyone can read questions, only admins can modify
CREATE POLICY "Anyone can view questions" ON assessment_questions
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert questions" ON assessment_questions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update questions" ON assessment_questions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Assessment submissions: Users can manage their own submissions
CREATE POLICY "Users can view own submissions" ON assessment_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions" ON assessment_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions" ON assessment_submissions
  FOR UPDATE USING (auth.uid() = user_id);

-- Assessment responses: Users can manage their own responses
CREATE POLICY "Users can view own responses" ON assessment_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assessment_submissions 
      WHERE assessment_submissions.id = assessment_responses.submission_id 
      AND assessment_submissions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own responses" ON assessment_responses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessment_submissions 
      WHERE assessment_submissions.id = assessment_responses.submission_id 
      AND assessment_submissions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own responses" ON assessment_responses
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM assessment_submissions 
      WHERE assessment_submissions.id = assessment_responses.submission_id 
      AND assessment_submissions.user_id = auth.uid()
    )
  );

-- Reflections: Users can manage their own reflections
CREATE POLICY "Users can view own reflections" ON reflections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reflections" ON reflections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reflections" ON reflections
  FOR UPDATE USING (auth.uid() = user_id);

-- Teams: Team members can view their teams, only admins can modify
CREATE POLICY "Users can view teams they belong to" ON teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = teams.id 
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can insert teams" ON teams
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    OR auth.uid() = created_by
  );

CREATE POLICY "Only team admins can update teams" ON teams
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = teams.id 
      AND team_members.user_id = auth.uid() 
      AND team_members.role = 'admin'
    )
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Team members: Team admins can manage team members
CREATE POLICY "Users can view team members of their teams" ON team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members AS tm 
      WHERE tm.team_id = team_members.team_id 
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team admins can insert team members" ON team_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = team_id 
      AND team_members.user_id = auth.uid() 
      AND team_members.role = 'admin'
    )
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Team admins can update team members" ON team_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = team_id 
      AND team_members.user_id = auth.uid() 
      AND team_members.role = 'admin'
    )
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user(); 