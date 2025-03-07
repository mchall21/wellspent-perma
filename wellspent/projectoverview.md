# Wellspent PERMA-V Assessment Tool

## Project Overview
The Wellspent PERMA-V Assessment Tool is a web application designed to assess users' wellbeing using the PERMA-V framework (Positive emotion, Engagement, Relationships, Meaning, Accomplishment, plus Vitality). The tool allows users to compare their personal and workplace wellbeing simultaneously through a streamlined assessment process with paired questions and dual sliders.

## Key Features

### Assessment Functionality
- Simple authentication with role-based access (individual, coach, manager, admin)
- Paired question interface with dual sliders for personal and workplace contexts
- 11-point scale (0-10) response format
- Score calculation based on PERMA-V methodology
- Tracking of changes over time for returning users

### Results & Reflection
- Multiple visualization types (bar graph, radar chart, heat map)
- Guided reflection with structured priority selection and freeform goal setting
- Comparison between personal and workplace scores

### Team/Cohort Functionality
- Team creation and management with cohort-specific assessment links
- Role-based access to team data
- Team analytics with aggregated scores
- Individual review capabilities for coaches

## Technology Stack
- **Frontend**: Next.js with shadcn UI components, Tailwind CSS
- **Backend**: Supabase for authentication, database, and storage
- **Deployment**: Vercel (frontend), Supabase (backend services)

## Target Audience
- Individuals seeking personal wellbeing assessment
- Teams in organizational settings
- Coaches and facilitators for reviewing individual assessments
- Managers for team analytics and insights

## Assessment Methodology
The assessment uses a paired approach to questions, asking users to rate aspects of their wellbeing in both personal and work contexts simultaneously. This approach:
- Reduces the assessment time to under 10 minutes
- Highlights disparities between personal and work wellbeing
- Provides a more nuanced view of overall wellbeing

## Design Philosophy
- Mobile-first, responsive design
- Clean, intuitive user interface with shadcn UI components
- Focus on user experience and accessibility
- Direct comparison between personal and work life