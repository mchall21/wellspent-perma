"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/database-types";
import { revalidatePath } from "next/cache";
import { Response } from "@/lib/hooks/use-assessment";

export async function createAssessmentSubmission(userId: string) {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set: () => {}, // Server actions can't set cookies
        remove: () => {}, // Server actions can't remove cookies
      },
    }
  );
  
  const { data, error } = await supabase
    .from("assessment_submissions")
    .insert({
      user_id: userId,
      completed: false,
    })
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function submitAssessmentResponses(
  submissionId: number,
  responses: Response[]
) {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set: () => {}, // Server actions can't set cookies
        remove: () => {}, // Server actions can't remove cookies
      },
    }
  );
  
  // Convert responses to the format expected by the database
  const formattedResponses = responses.map((response) => ({
    submission_id: submissionId,
    question_id: response.questionId,
    personal_score: response.personalScore,
    work_score: response.workScore,
  }));
  
  // Insert all responses
  const { error: responsesError } = await supabase
    .from("assessment_responses")
    .insert(formattedResponses);
  
  if (responsesError) {
    throw new Error(responsesError.message);
  }
  
  // Mark the submission as completed
  const { error: updateError } = await supabase
    .from("assessment_submissions")
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq("id", submissionId);
  
  if (updateError) {
    throw new Error(updateError.message);
  }
  
  revalidatePath("/assessment");
  revalidatePath("/results");
  
  return { success: true, submissionId };
}

export async function getAssessmentQuestions() {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set: () => {}, // Server actions can't set cookies
        remove: () => {}, // Server actions can't remove cookies
      },
    }
  );
  
  const { data, error } = await supabase
    .from("assessment_questions")
    .select("*")
    .eq("active", true)
    .order("question_order");
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function getSubmissionById(submissionId: number) {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set: () => {}, // Server actions can't set cookies
        remove: () => {}, // Server actions can't remove cookies
      },
    }
  );
  
  const { data, error } = await supabase
    .from("assessment_submissions")
    .select("*")
    .eq("id", submissionId)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function getSubmissionResponses(submissionId: number) {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set: () => {}, // Server actions can't set cookies
        remove: () => {}, // Server actions can't remove cookies
      },
    }
  );
  
  const { data, error } = await supabase
    .from("assessment_responses")
    .select("*, assessment_questions(*)")
    .eq("submission_id", submissionId);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
} 