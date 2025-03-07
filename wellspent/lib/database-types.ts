export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: string
          profile_info: Json | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: string
          profile_info?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: string
          profile_info?: Json | null
          created_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          created_by?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      assessment_questions: {
        Row: {
          id: string
          text: string
          category: string
          personal_context_label: string
          work_context_label: string
          scale_start: number
          scale_end: number
          scale_start_label: string
          scale_end_label: string
          question_order: number
          active: boolean
        }
        Insert: {
          id?: string
          text: string
          category: string
          personal_context_label: string
          work_context_label: string
          scale_start?: number
          scale_end?: number
          scale_start_label: string
          scale_end_label: string
          question_order: number
          active?: boolean
        }
        Update: {
          id?: string
          text?: string
          category?: string
          personal_context_label?: string
          work_context_label?: string
          scale_start?: number
          scale_end?: number
          scale_start_label?: string
          scale_end_label?: string
          question_order?: number
          active?: boolean
        }
      }
      assessment_submissions: {
        Row: {
          id: string
          user_id: string
          team_id: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          team_id?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          team_id?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
      assessment_responses: {
        Row: {
          id: string
          submission_id: string
          question_id: string
          personal_response_value: number | null
          work_response_value: number | null
        }
        Insert: {
          id?: string
          submission_id: string
          question_id: string
          personal_response_value?: number | null
          work_response_value?: number | null
        }
        Update: {
          id?: string
          submission_id?: string
          question_id?: string
          personal_response_value?: number | null
          work_response_value?: number | null
        }
      }
      assessment_results: {
        Row: {
          id: string
          submission_id: string
          category: string
          score: number
          context: string
        }
        Insert: {
          id?: string
          submission_id: string
          category: string
          score: number
          context: string
        }
        Update: {
          id?: string
          submission_id?: string
          category?: string
          score?: number
          context?: string
        }
      }
      reflection_entries: {
        Row: {
          id: string
          user_id: string
          submission_id: string
          category: string
          priority: string
          notes: string | null
          goals: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          submission_id: string
          category: string
          priority: string
          notes?: string | null
          goals?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          submission_id?: string
          category?: string
          priority?: string
          notes?: string | null
          goals?: string | null
          created_at?: string
        }
      }
    }
  }
} 