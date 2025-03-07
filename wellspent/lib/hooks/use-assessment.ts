"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Database } from "@/lib/database-types";
import { supabase } from "@/lib/supabase";

// Define a more flexible Question type to handle both database and mock questions
export type Question = {
  id: string;
  text: string;
  category: string;
  personal_context_label: string;
  work_context_label: string;
  scale_start: number;
  scale_end: number;
  scale_start_label: string;
  scale_end_label: string;
  question_order: number;
  active?: boolean;
  component_type?: string;
  component_config?: any;
  [key: string]: any; // Allow for additional properties
};

export type Response = {
  questionId: string;
  personalScore: number;
  workScore: number;
};

export function useAssessment(questions: Question[]) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Initialize responses with default values (5) for all questions
  useEffect(() => {
    if (questions.length > 0 && responses.length === 0) {
      const initialResponses = questions.map((question) => ({
        questionId: question.id,
        personalScore: 5, // Default to middle value
        workScore: 5, // Default to middle value
      }));
      setResponses(initialResponses);
    }
  }, [questions, responses.length]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 1 
    ? Math.round((currentQuestionIndex / (totalQuestions - 1)) * 100) 
    : 0;

  const updatePersonalResponse = (questionId: string, score: number) => {
    setResponses((prev) =>
      prev.map((response) =>
        response.questionId === questionId 
          ? { ...response, personalScore: score } 
          : response
      )
    );
  };

  const updateWorkResponse = (questionId: string, score: number) => {
    setResponses((prev) =>
      prev.map((response) =>
        response.questionId === questionId 
          ? { ...response, workScore: score } 
          : response
      )
    );
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      // Get the current user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error getting session:", sessionError);
        throw new Error(`Authentication error: ${sessionError.message}`);
      }
      
      if (!session) {
        throw new Error("Not authenticated");
      }
      
      console.log("Creating assessment submission for user:", session.user.id);
      
      // Create a new assessment submission
      let submissionData;
      const { data: initialSubmission, error: submissionError } = await supabase
        .from("assessment_submissions")
        .insert({
          user_id: session.user.id,
          // Don't include the completed field if it doesn't exist
          // completed: false, 
        })
        .select()
        .single();
      
      if (submissionError) {
        console.error("Error creating submission:", submissionError);
        console.error("Error details:", JSON.stringify(submissionError));
        
        // Try a more direct approach without the .single() method
        console.log("Trying alternative submission approach...");
        const { data: altSubmission, error: altError } = await supabase
          .from("assessment_submissions")
          .insert({
            user_id: session.user.id,
            // Don't include the completed field if it doesn't exist
            // completed: false,
          })
          .select();
        
        if (altError) {
          console.error("Alternative submission also failed:", altError);
          throw new Error(`Failed to create submission: ${altError.message}`);
        }
        
        if (!altSubmission || altSubmission.length === 0) {
          throw new Error("Failed to create submission: No data returned");
        }
        
        console.log("Alternative submission succeeded:", altSubmission);
        submissionData = altSubmission[0];
      } else {
        submissionData = initialSubmission;
      }
      
      console.log("Created submission:", submissionData);
      
      // Format the responses for the assessment_responses table
      // Using the correct structure with personal_response_value and work_response_value
      const formattedResponses = responses.map(response => ({
        submission_id: submissionData.id,
        question_id: response.questionId,
        personal_response_value: response.personalScore,
        work_response_value: response.workScore
      }));
      
      console.log("Saving responses to assessment_responses table:", formattedResponses);
      
      // Insert directly into assessment_responses table
      const { error: responsesError } = await supabase
        .from("assessment_responses")
        .insert(formattedResponses);
      
      if (responsesError) {
        console.error("Error inserting responses to assessment_responses:", responsesError);
        console.error("Error details:", JSON.stringify(responsesError));
        throw new Error(`Failed to save responses: ${responsesError.message}`);
      } else {
        console.log("Successfully saved responses to assessment_responses");
      }
      
      // Calculate dimension scores for assessment_results
      try {
        // Group responses by dimension/category
        const dimensionMap = new Map();
        
        // First, fetch the questions to get their categories
        const { data: questions, error: questionsError } = await supabase
          .from("assessment_questions")
          .select("id, category")
          .in("id", responses.map(r => r.questionId));
        
        if (questionsError) {
          console.error("Error fetching questions for results calculation:", questionsError);
          throw new Error(`Failed to fetch questions: ${questionsError.message}`);
        }
        
        // Create a map of question ID to category
        const questionCategories = new Map();
        questions.forEach(q => {
          questionCategories.set(q.id, q.category);
        });
        
        // Group responses by dimension and calculate averages
        responses.forEach(response => {
          const category = questionCategories.get(response.questionId);
          if (!category) return;
          
          if (!dimensionMap.has(category)) {
            dimensionMap.set(category, {
              personal: { sum: 0, count: 0 },
              work: { sum: 0, count: 0 }
            });
          }
          
          const dimension = dimensionMap.get(category);
          dimension.personal.sum += response.personalScore;
          dimension.personal.count += 1;
          dimension.work.sum += response.workScore;
          dimension.work.count += 1;
        });
        
        // Calculate average scores for each dimension
        type DimensionResult = {
          submission_id: string;
          category: string;
          score: number;
          context: 'personal' | 'workplace';
        };
        
        const dimensionResults: DimensionResult[] = [];
        
        dimensionMap.forEach((scores, dimension) => {
          const personalScore = scores.personal.count > 0 
            ? scores.personal.sum / scores.personal.count 
            : 0;
          
          const workScore = scores.work.count > 0 
            ? scores.work.sum / scores.work.count 
            : 0;
          
          // Add personal context result
          dimensionResults.push({
            submission_id: submissionData.id,
            category: dimension,
            score: personalScore,
            context: 'personal'
          });
          
          // Add work context result
          dimensionResults.push({
            submission_id: submissionData.id,
            category: dimension,
            score: workScore,
            context: 'workplace'
          });
        });
        
        // Save dimension results
        if (dimensionResults.length > 0) {
          console.log("Saving dimension results:", dimensionResults);
          
          const { error: resultsError } = await supabase
            .from("assessment_results")
            .insert(dimensionResults);
          
          if (resultsError) {
            console.error("Error saving dimension results:", resultsError);
            console.error("Error details:", JSON.stringify(resultsError));
            // Continue anyway since responses are saved
          } else {
            console.log("Dimension results saved successfully");
          }
        }
      } catch (error) {
        console.error("Error calculating and saving dimension results:", error);
        // Continue anyway since responses are saved
      }
      
      console.log("Submission process completed successfully");
      
      // Navigate to the completion page
      window.location.href = "/assessment/complete";
    } catch (error) {
      console.error("Error submitting assessment:", error);
      setSubmissionError(`Error submitting assessment: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    responses,
    isSubmitting,
    submissionError,
    updatePersonalResponse,
    updateWorkResponse,
    goToNextQuestion,
    goToPreviousQuestion,
    submitAssessment,
  };
}