# Supabase Configuration

## Database Schema

### Users Table
This table extends the default Supabase auth.users table with additional profile information.

```sql
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  name text,
  role text check (role in ('individual', 'coach', 'manager', 'admin')) not null default 'individual',
  profile_info jsonb,
  created_at timestamp with time zone default now() not null
);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;

-- Policies
create policy "Users can view their own profile" 
  on public.users for select 
  using (auth.uid() = id);

create policy "Users can update their own profile" 
  on public.users for update 
  using (auth.uid() = id);

create policy "Admins have full access to profiles" 
  on public.users 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Create a trigger to create a user profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Teams Table
```sql
create table public.teams (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  created_at timestamp with time zone default now() not null,
  created_by uuid references public.users not null
);

-- Set up Row Level Security (RLS)
alter table public.teams enable row level security;

-- Policies
create policy "Team members can view teams they belong to"
  on public.teams for select
  using (exists (
    select 1 from public.team_members
    where team_id = teams.id and user_id = auth.uid()
  ));

create policy "Managers and admins can create teams"
  on public.teams for insert
  with check (exists (
    select 1 from public.users
    where id = auth.uid() and (role = 'manager' or role = 'admin')
  ));

create policy "Team creators can update their teams"
  on public.teams for update
  using (created_by = auth.uid());
```

### Team Members Table
```sql
create table public.team_members (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid references public.teams not null,
  user_id uuid references public.users not null,
  role text check (role in ('member', 'coach', 'manager')) not null default 'member',
  joined_at timestamp with time zone default now() not null,
  unique (team_id, user_id)
);

-- Set up Row Level Security (RLS)
alter table public.team_members enable row level security;

-- Policies
create policy "Users can view their own team memberships"
  on public.team_members for select
  using (user_id = auth.uid());

create policy "Team managers can view all team members"
  on public.team_members for select
  using (exists (
    select 1 from public.team_members
    where team_id = team_members.team_id
    and user_id = auth.uid()
    and role = 'manager'
  ));

create policy "Team managers can add team members"
  on public.team_members for insert
  with check (exists (
    select 1 from public.team_members
    where team_id = team_members.team_id
    and user_id = auth.uid()
    and role = 'manager'
  ));
```

### Assessment Questions Table
```sql
create table public.assessment_questions (
  id uuid primary key default uuid_generate_v4(),
  text text not null,
  category text check (category in ('P', 'E', 'R', 'M', 'A', 'V', 'N', 'Lon', 'general')) not null,
  personal_context_label text not null,
  work_context_label text not null,
  scale_start integer not null default 0,
  scale_end integer not null default 10,
  scale_start_label text not null,
  scale_end_label text not null,
  question_order integer not null,
  active boolean not null default true
);

-- Set up Row Level Security (RLS)
alter table public.assessment_questions enable row level security;

-- Policies
create policy "Anyone can view active questions"
  on public.assessment_questions for select
  using (active = true);

create policy "Admins can manage questions"
  on public.assessment_questions
  using (exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  ));
```

### Assessment Submissions Table
```sql
create table public.assessment_submissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users not null,
  team_id uuid references public.teams,
  created_at timestamp with time zone default now() not null,
  completed_at timestamp with time zone
);

-- Set up Row Level Security (RLS)
alter table public.assessment_submissions enable row level security;

-- Policies
create policy "Users can view their own submissions"
  on public.assessment_submissions for select
  using (user_id = auth.uid());

create policy "Users can create their own submissions"
  on public.assessment_submissions for insert
  with check (user_id = auth.uid());

create policy "Coaches can view team member submissions"
  on public.assessment_submissions for select
  using (exists (
    select 1 from public.team_members
    where team_id = assessment_submissions.team_id
    and user_id = auth.uid()
    and role = 'coach'
  ));
```

### Assessment Responses Table
```sql
create table public.assessment_responses (
  id uuid primary key default uuid_generate_v4(),
  submission_id uuid references public.assessment_submissions not null,
  question_id uuid references public.assessment_questions not null,
  personal_response_value integer check (personal_response_value >= 0 and personal_response_value <= 10),
  work_response_value integer check (work_response_value >= 0 and work_response_value <= 10)
);

-- Set up Row Level Security (RLS)
alter table public.assessment_responses enable row level security;

-- Policies
create policy "Users can view their own responses"
  on public.assessment_responses for select
  using (exists (
    select 1 from public.assessment_submissions
    where id = assessment_responses.submission_id
    and user_id = auth.uid()
  ));

create policy "Users can create their own responses"
  on public.assessment_responses for insert
  with check (exists (
    select 1 from public.assessment_submissions
    where id = assessment_responses.submission_id
    and user_id = auth.uid()
  ));

create policy "Coaches can view team member responses"
  on public.assessment_responses for select
  using (exists (
    select 1 from public.assessment_submissions s
    join public.team_members tm on s.team_id = tm.team_id
    where s.id = assessment_responses.submission_id
    and tm.user_id = auth.uid()
    and tm.role = 'coach'
  ));
```

### Assessment Results Table
```sql
create table public.assessment_results (
  id uuid primary key default uuid_generate_v4(),
  submission_id uuid references public.assessment_submissions not null,
  category text check (category in ('P', 'E', 'R', 'M', 'A', 'V', 'N', 'Lon', 'PERMA_overall')) not null,
  score numeric not null,
  context text check (context in ('personal', 'workplace')) not null
);

-- Set up Row Level Security (RLS)
alter table public.assessment_results enable row level security;

-- Policies
create policy "Users can view their own results"
  on public.assessment_results for select
  using (exists (
    select 1 from public.assessment_submissions
    where id = assessment_results.submission_id
    and user_id = auth.uid()
  ));

create policy "Coaches can view team member results"
  on public.assessment_results for select
  using (exists (
    select 1 from public.assessment_submissions s
    join public.team_members tm on s.team_id = tm.team_id
    where s.id = assessment_results.submission_id
    and tm.user_id = auth.uid()
    and tm.role = 'coach'
  ));
```

### Reflection Entries Table
```sql
create table public.reflection_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users not null,
  submission_id uuid references public.assessment_submissions not null,
  category text check (category in ('P', 'E', 'R', 'M', 'A', 'V')) not null,
  priority text check (priority in ('high', 'medium', 'low')) not null,
  notes text,
  goals text,
  created_at timestamp with time zone default now() not null
);

-- Set up Row Level Security (RLS)
alter table public.reflection_entries enable row level security;

-- Policies
create policy "Users can view and manage their own reflections"
  on public.reflection_entries
  using (user_id = auth.uid());

create policy "Coaches can view team member reflections"
  on public.reflection_entries for select
  using (exists (
    select 1 from public.assessment_submissions s
    join public.team_members tm on s.team_id = tm.team_id
    where s.id = reflection_entries.submission_id
    and tm.user_id = auth.uid()
    and tm.role = 'coach'
  ));
```

## Supabase Auth Configuration

### Enable Email/Password Auth
1. Go to Authentication > Providers
2. Ensure Email provider is enabled
3. Configure settings:
   - Enable "Confirm email"
   - Set "Secure email change" to true
   - Set minimum password length to 8

### Set Up Authentication Redirects
1. Go to Authentication > URL Configuration
2. Add your site URL (e.g., https://wellspent.vercel.app)
3. Add redirect URLs:
   - https://wellspent.vercel.app/auth/callback
   - http://localhost:3000/auth/callback (for development)

## Environment Variables

For local development, create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional, for admin functions)
```

For production deployment on Vercel, add these environment variables in the Vercel project settings.

## Questions Data Seeding

Run the following SQL in the Supabase SQL Editor to seed the initial assessment questions:

```sql
INSERT INTO public.assessment_questions 
(text, category, personal_context_label, work_context_label, scale_start_label, scale_end_label, question_order)
VALUES
('How often do you feel joyful?', 'P', 'In general', 'At work', 'never', 'always', 1),
('How often do you feel positive?', 'P', 'In general', 'At work', 'never', 'always', 2),
('To what extent do you feel contented?', 'P', 'In general', 'At work', 'not at all', 'completely', 3),
('How often do you become absorbed in what you are doing?', 'E', 'In general', 'At work', 'never', 'always', 4),
('To what extent do you feel excited and interested?', 'E', 'In things generally', 'In your work', 'not at all', 'completely', 5),
('How often do you lose track of time while doing something you enjoy?', 'E', 'In general', 'At work', 'never', 'always', 6),
('To what extent do you receive help and support when you need it?', 'R', 'From others', 'From coworkers', 'not at all', 'completely', 7),
('To what extent do you feel appreciated?', 'R', 'Loved in general', 'Appreciated by coworkers', 'not at all', 'completely', 8),
('How satisfied are you with your relationships?', 'R', 'Personal relationships', 'Professional relationships', 'not at all', 'completely', 9),
('To what extent do you lead a purposeful and meaningful life/work?', 'M', 'Life in general', 'Your work', 'not at all', 'completely', 10),
('To what extent do you feel that what you do is valuable and worthwhile?', 'M', 'In your life', 'At work', 'not at all', 'completely', 11),
('To what extent do you have a sense of direction?', 'M', 'In your life', 'In your work', 'not at all', 'completely', 12),
('How often do you make progress toward accomplishing your goals?', 'A', 'Life goals', 'Work-related goals', 'never', 'always', 13),
('How often do you achieve the important goals you set for yourself?', 'A', 'Personal goals', 'Work goals', 'never', 'always', 14),
('How often are you able to handle your responsibilities?', 'A', 'General responsibilities', 'Work-related responsibilities', 'never', 'always', 15),
('How would you say your health/energy level is?', 'V', 'Overall health', 'Energy at work', 'terrible', 'excellent', 16),
('How satisfied are you with your physical vitality?', 'V', 'Overall', 'During the workday', 'not at all', 'completely', 17),
('Compared to others, how is your health/vitality?', 'V', 'Health (vs. peers of same age/sex)', 'Work vitality (vs. similar roles)', 'terrible', 'excellent', 18),
('How often do you feel anxious?', 'N', 'In general', 'At work', 'never', 'always', 19),
('How often do you feel angry?', 'N', 'In general', 'At work', 'never', 'always', 20),
('How often do you feel sad?', 'N', 'In general', 'At work', 'never', 'always', 21),
('How lonely do you feel?', 'Lon', 'In your daily life', 'At work', 'not at all', 'completely', 22),
('Taking all things together, how happy would you say you are?', 'general', 'With your life', 'With your work', 'not at all', 'completely', 23);
```