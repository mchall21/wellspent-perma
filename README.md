# WellSpent - PERMA-V Assessment Tool

WellSpent is a web application for conducting PERMA-V assessments, which measure well-being across multiple dimensions in both personal and work contexts.

## Database Schema

The application uses the following database tables:

### `assessment_questions`
Stores the questions used in the PERMA-V assessment.
- `id`: UUID - Primary key
- `text`: String - The question text
- `category`: String - The PERMA-V dimension (P, E, R, M, A, V)
- `personal_context_label`: String - Label for the personal context
- `work_context_label`: String - Label for the work context
- `scale_start`: Number - Start value of the rating scale
- `scale_end`: Number - End value of the rating scale
- `scale_start_label`: String - Label for the start of the scale
- `scale_end_label`: String - Label for the end of the scale
- `question_order`: Number - Order in which questions appear
- `active`: Boolean - Whether the question is active

### `assessment_submissions`
Tracks assessment sessions.
- `id`: UUID - Primary key
- `created_at`: Timestamp - When the submission was created
- `user_id`: UUID - Foreign key to the user who took the assessment

### `assessment_response`
Stores user responses with both personal and work scores in a single record.
- `id`: UUID - Primary key
- `submission_id`: UUID - Foreign key to the submission
- `question_id`: UUID - Foreign key to the question
- `personal_response_value`: Number - Score for personal context
- `work_response_value`: Number - Score for work context

### `assessment_responses`
Alternative format for storing user responses with separate records for personal and work contexts.
- `id`: UUID - Primary key
- `created_at`: Timestamp - When the response was created
- `submission_id`: UUID - Foreign key to the submission
- `question_id`: UUID - Foreign key to the question
- `score`: Number - The score given
- `context`: String - Either 'personal' or 'work'

### `assessment_results`
Stores calculated dimension scores for each submission.
- `id`: UUID - Primary key
- `created_at`: Timestamp - When the result was calculated
- `submission_id`: UUID - Foreign key to the submission
- `dimension`: String - The PERMA-V dimension
- `personal_score`: Number - Average score for personal context
- `work_score`: Number - Average score for work context

### `teams` and `team_members`
For future team functionality.

## Application Structure

The application is built with Next.js, React, TypeScript, and Supabase. Key components include:

### Assessment Flow
1. Users log in and start an assessment
2. Questions are loaded from the `assessment_questions` table
3. Users provide ratings for each question in both personal and work contexts
4. Responses are saved to either `assessment_response` or `assessment_responses` table
5. Dimension scores are calculated and saved to the `assessment_results` table
6. Users are redirected to the results page

### Results Visualization
The results page displays:
- Bar charts comparing personal and work scores across dimensions
- Radar charts showing the balance of scores
- Score cards for each dimension
- Overall scores and insights based on the assessment

## Development

### Prerequisites
- Node.js
- npm or yarn
- Supabase account

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`

## Database Handling

The application is designed to work with both `assessment_response` and `assessment_responses` tables for flexibility. When submitting an assessment:

1. It first attempts to save to the `assessment_response` table (one record per question with both personal and work scores)
2. If that fails, it falls back to the `assessment_responses` table (two records per question, one for each context)
3. It calculates dimension averages and stores them in the `assessment_results` table

When viewing results:
1. It first checks for pre-calculated results in the `assessment_results` table
2. If not found, it calculates scores from the response tables on the fly 