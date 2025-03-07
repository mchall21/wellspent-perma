# Implementation Plan



## Project Setup and Configuration

- [ ] Step 1: Initialize Next.js project with shadcn UI
  - **Task**: Create a new Next.js project with TypeScript, configure shadcn UI, and set up the project structure
  - **Files**:
    - `package.json`: Add necessary dependencies
    - `tsconfig.json`: Configure TypeScript
    - `next.config.js`: Configure Next.js
    - `tailwind.config.js`: Configure Tailwind CSS
    - `app/layout.tsx`: Create root layout
    - `app/page.tsx`: Create landing page
    - `components.json`: Configure shadcn UI
  - **User Instructions**: 
    - Run `npx create-next-app@latest wellspent --typescript --tailwind --app --eslint`
    - Change to the project directory with `cd wellspent`
    - Install shadcn UI with `npx shadcn-ui@latest init`
    - Choose the default options for shadcn UI setup

- [ ] Step 2: Configure Supabase client
  - **Task**: Set up Supabase client for authentication and database interactions
  - **Files**:
    - `lib/supabase.ts`: Create Supabase client
    - `.env.local`: Add Supabase environment variables
    - `middleware.ts`: Set up authentication middleware
    - `app/api/auth/callback/route.ts`: Create auth callback route
  - **User Instructions**:
    - Create a new Supabase project at supabase.com
    - Install Supabase packages with `npm install @supabase/supabase-js @supabase/auth-helpers-nextjs`
    - Get your Supabase URL and anon key from the project settings
    - Create a `.env.local` file with your Supabase credentials

## Database Setup

- [ ] Step 3: Create database schema in Supabase
  - **Task**: Create the necessary tables and relationships in Supabase
  - **Files**:
    - `lib/database-types.ts`: Define TypeScript types for database schema
    - `scripts/schema.sql`: SQL script for creating tables
  - **User Instructions**:
    - Navigate to the SQL Editor in your Supabase dashboard
    - Run the provided SQL script to create all tables
    - Configure RLS (Row Level Security) policies for each table

- [ ] Step 4: Create initial questions data
  - **Task**: Populate the assessment_questions table with the paired questions
  - **Files**:
    - `scripts/seed-questions.sql`: SQL script for inserting questions
  - **User Instructions**:
    - Run the provided SQL script in the Supabase SQL Editor to populate the questions table

## Authentication and User Management

- [ ] Step 5: Implement authentication UI
  - **Task**: Create authentication pages for sign up, sign in, and sign out
  - **Files**:
    - `app/auth/signup/page.tsx`: Sign up page
    - `app/auth/signin/page.tsx`: Sign in page
    - `components/auth/auth-form.tsx`: Reusable authentication form
    - `components/auth/sign-out-button.tsx`: Sign out button component
    - `lib/auth.ts`: Authentication utilities
  - **Step Dependencies**: Step 2
  - **User Instructions**: None

- [ ] Step 6: Implement user profile and roles
  - **Task**: Create user profile management and role assignment
  - **Files**:
    - `app/profile/page.tsx`: Profile page
    - `components/profile/profile-form.tsx`: Profile edit form
    - `lib/actions/user.ts`: Server actions for user management
  - **Step Dependencies**: Step 5
  - **User Instructions**: None

## Core UI Components

- [ ] Step 7: Create layout and navigation components
  - **Task**: Implement the main layout, navigation, and shared UI components
  - **Files**:
    - `components/ui/header.tsx`: Header component
    - `components/ui/footer.tsx`: Footer component
    - `components/ui/sidebar.tsx`: Sidebar navigation
    - `components/ui/page-container.tsx`: Page container component
    - `app/layout.tsx`: Update root layout
  - **Step Dependencies**: Step 1
  - **User Instructions**: None

- [ ] Step 8: Implement slider components for assessment
  - **Task**: Create custom slider components for the dual-slider question interface
  - **Files**:
    - `components/assessment/dual-slider.tsx`: Dual slider component for paired questions
    - `components/assessment/slider-label.tsx`: Labels for sliders
    - `components/ui/slider.tsx`: Install shadcn UI slider component
  - **Step Dependencies**: Step 1
  - **User Instructions**: 
    - Run `npx shadcn-ui@latest add slider` to install the slider component

## Assessment Flow

- [ ] Step 9: Create assessment start page
  - **Task**: Implement the assessment start page with instructions
  - **Files**:
    - `app/assessment/page.tsx`: Assessment start page
    - `components/assessment/start-assessment.tsx`: Start assessment button and info
  - **Step Dependencies**: Step 7
  - **User Instructions**: None

- [ ] Step 10: Implement assessment question interface
  - **Task**: Create the main assessment interface with questions and dual sliders
  - **Files**:
    - `app/assessment/questions/page.tsx`: Questions page
    - `components/assessment/question-card.tsx`: Question card component
    - `components/assessment/progress-bar.tsx`: Progress indicator
    - `components/assessment/navigation-buttons.tsx`: Next/previous buttons
    - `lib/hooks/use-assessment.ts`: Hook for managing assessment state
  - **Step Dependencies**: Step 8, Step 4
  - **User Instructions**: None

- [ ] Step 11: Implement assessment submission
  - **Task**: Create functionality to submit assessment responses to the database
  - **Files**:
    - `lib/actions/assessment.ts`: Server actions for assessment submission
    - `app/assessment/complete/page.tsx`: Assessment completion page
    - `components/assessment/submit-button.tsx`: Submit button component
  - **Step Dependencies**: Step 10, Step 3
  - **User Instructions**: None

## Results Visualization

- [ ] Step 12: Implement bar chart visualization
  - **Task**: Create bar chart visualization for PERMA-V scores
  - **Files**:
    - `components/results/bar-chart.tsx`: Bar chart component
    - `lib/utils/chart-utils.ts`: Utilities for chart data formatting
  - **Step Dependencies**: Step 11
  - **User Instructions**: 
    - Install Recharts with `npm install recharts`

- [ ] Step 13: Implement radar chart visualization
  - **Task**: Create radar chart for comparing personal and workplace scores
  - **Files**:
    - `components/results/radar-chart.tsx`: Radar chart component
  - **Step Dependencies**: Step 12
  - **User Instructions**: None

- [ ] Step 14: Create results summary page
  - **Task**: Implement the results summary page with visualizations and key insights
  - **Files**:
    - `app/results/[submissionId]/page.tsx`: Results page
    - `components/results/score-card.tsx`: Score card component
    - `components/results/score-comparison.tsx`: Personal vs work comparison
    - `lib/utils/score-calculation.ts`: Score calculation utilities
  - **Step Dependencies**: Step 12, Step 13
  - **User Instructions**: None

## Reflection Interface

- [ ] Step 15: Create reflection form
  - **Task**: Implement the reflection form with priority selection and goal setting
  - **Files**:
    - `app/results/[submissionId]/reflect/page.tsx`: Reflection page
    - `components/reflection/priority-select.tsx`: Priority selection component
    - `components/reflection/goal-input.tsx`: Goal setting text area
    - `lib/actions/reflection.ts`: Server actions for reflection submission
  - **Step Dependencies**: Step 14
  - **User Instructions**: None

- [ ] Step 16: Implement reflection summary view
  - **Task**: Create a view to display saved reflections and goals
  - **Files**:
    - `app/results/[submissionId]/reflection-summary/page.tsx`: Reflection summary page
    - `components/reflection/reflection-card.tsx`: Reflection display component
  - **Step Dependencies**: Step 15
  - **User Instructions**: None

## Team Management

- [ ] Step 17: Create team management interfaces
  - **Task**: Implement team creation, editing, and member management
  - **Files**:
    - `app/teams/page.tsx`: Teams list page
    - `app/teams/create/page.tsx`: Create team page
    - `app/teams/[teamId]/page.tsx`: Team details page
    - `components/teams/team-form.tsx`: Team creation/edit form
    - `components/teams/member-list.tsx`: Team members list
    - `lib/actions/team.ts`: Server actions for team management
  - **Step Dependencies**: Step 6
  - **User Instructions**: None

- [ ] Step 18: Implement team member invitation system
  - **Task**: Create functionality to invite users to teams
  - **Files**:
    - `app/teams/[teamId]/invite/page.tsx`: Invite page
    - `components/teams/invite-form.tsx`: Invitation form
    - `lib/actions/invitation.ts`: Server actions for sending invitations
    - `app/api/invitations/route.ts`: API route for processing invitations
  - **Step Dependencies**: Step 17
  - **User Instructions**: None

## Team Analytics

- [ ] Step 19: Implement team assessment results view
  - **Task**: Create a dashboard for viewing team assessment results
  - **Files**:
    - `app/teams/[teamId]/results/page.tsx`: Team results page
    - `components/teams/team-score-chart.tsx`: Team score visualization
    - `components/teams/team-comparison.tsx`: Team comparison component
    - `lib/utils/team-analytics.ts`: Team data analysis utilities
  - **Step Dependencies**: Step 17, Step 14
  - **User Instructions**: None

- [ ] Step 20: Create coach view for individual results
  - **Task**: Implement the coach view for accessing individual team member results
  - **Files**:
    - `app/teams/[teamId]/members/[userId]/page.tsx`: Individual member results page
    - `components/teams/member-results.tsx`: Member results component
    - `lib/utils/coach-access.ts`: Coach access utilities
  - **Step Dependencies**: Step 19
  - **User Instructions**: None

## Admin Features

- [ ] Step 21: Create admin dashboard
  - **Task**: Implement an admin dashboard for managing the application
  - **Files**:
    - `app/admin/page.tsx`: Admin dashboard page
    - `components/admin/stats-cards.tsx`: Statistics cards
    - `lib/actions/admin.ts`: Server actions for admin functions
  - **Step Dependencies**: Step 6
  - **User Instructions**: None

- [ ] Step 22: Implement question management interface
  - **Task**: Create an interface for administrators to manage assessment questions
  - **Files**:
    - `app/admin/questions/page.tsx`: Questions management page
    - `app/admin/questions/edit/[questionId]/page.tsx`: Question edit page
    - `components/admin/question-form.tsx`: Question edit form
    - `components/admin/question-table.tsx`: Questions table
    - `lib/actions/questions.ts`: Server actions for question management
  - **Step Dependencies**: Step 21
  - **User Instructions**: None

## Final Integration and Refinement

- [ ] Step 23: Implement role-based access controls
  - **Task**: Add comprehensive role-based access controls across the application
  - **Files**:
    - `lib/auth/rbac.ts`: Role-based access control utilities
    - `middleware.ts`: Update middleware for role-based route protection
    - `components/ui/restricted-content.tsx`: Component for conditionally rendering content based on roles
  - **Step Dependencies**: Step 6, Step 17
  - **User Instructions**: 
    - Configure RLS policies in Supabase to enforce role-based access

- [ ] Step 24: Add data export functionality
  - **Task**: Implement functionality to export assessment data
  - **Files**:
    - `components/results/export-button.tsx`: Export button component
    - `lib/utils/export-utils.ts`: Data export utilities
    - `app/api/export/route.ts`: API route for handling exports
  - **Step Dependencies**: Step 14
  - **User Instructions**: None

- [ ] Step 25: Final polishing and error handling
  - **Task**: Add comprehensive error handling, loading states, and final UI polishing
  - **Files**:
    - `components/ui/error-boundary.tsx`: Error boundary component
    - `components/ui/loading.tsx`: Loading component
    - `lib/utils/error-utils.ts`: Error handling utilities
    - Multiple component files for UI refinements
  - **Step Dependencies**: All previous steps
  - **User Instructions**: None

## Summary and Key Considerations

This implementation plan outlines a step-by-step approach to building the Wellspent PERMA-V Assessment Tool, focusing on rapid development while ensuring a high-quality end product. The plan is structured to build foundational elements first, then progressively add features in a logical sequence.

Key considerations for implementation:

1. **Mobile-First Design**: Since 50% or more of users will be on mobile devices, ensure that all UI components are thoroughly tested on mobile, especially the dual slider interface.

2. **Database Design**: The paired question approach significantly optimizes the assessment process, but requires careful implementation in both the database and UI to ensure accurate data capture.

3. **Authentication and Role Management**: The role-based access system is central to the application's functionality, so implement this carefully to ensure proper data security.

4. **Performance Optimization**: For the assessment interface, optimize for performance to ensure smooth slider interactions, especially on mobile devices.

5. **Supabase Integration**: Leverage Supabase features fully for authentication, database, and RLS policies to speed up development.

6. **Phased Development**: If time is extremely limited, consider implementing the core assessment, results visualization, and reflection features first, then adding team and admin features in subsequent phases.