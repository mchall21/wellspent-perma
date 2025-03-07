"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageContainer } from "@/components/ui/page-container";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryRenderer } from "@/components/assessment/question-renderers";

// Type definitions
type Context = "personal" | "work";
type ResponseValue = number;
type Response = {
  [key: string]: {
    [context in Context]?: ResponseValue;
  };
};

// Database question type
interface Question {
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
}

// Response type with joined question data
interface ResponseWithQuestion {
  id: string;
  question_id: string;
  personal_response_value: number | null;
  work_response_value: number | null;
  assessment_questions: {
    category: string;
  };
}

export default function AssessmentQuestions() {
  const router = useRouter();
  
  // State management
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Response>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Fetch questions from the database
  useEffect(() => {
    async function fetchData() {
      try {
        // Check if user is authenticated
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          router.push("/auth/signin");
          return;
        }
        
        setUserId(userData.user.id);
        
        // Fetch questions from the database
        const { data: questionsData, error: questionsError } = await supabase
          .from("assessment_questions")
          .select("*")
          .eq("active", true)
          .order("question_order", { ascending: true });
          
        if (questionsError) {
          throw questionsError;
        }
        
        if (!questionsData || questionsData.length === 0) {
          setError("No assessment questions found. Please try again later.");
          return;
        }
        
        setQuestions(questionsData);
        
        // Create a submission record
        const { data: submissionData, error: submissionError } = await supabase
          .from("assessment_submissions")
          .insert({
            user_id: userData.user.id,
            team_id: null, // Can be updated if team context is needed
          })
          .select("id")
          .single();
          
        if (submissionError) {
          throw submissionError;
        }
        
        setSubmissionId(submissionData.id);
      } catch (error) {
        console.error("Error setting up assessment:", error);
        setError("Failed to load assessment. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [router]);

  // Handle value changes
  const handleValueChange = (questionId: string, context: Context, value: ResponseValue) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [context]: value
      }
    }));
  };

  // Navigation between questions
  const goToNextQuestion = async () => {
    // Save the current question's responses
    if (submissionId && questions[currentQuestionIndex]) {
      setSaveStatus('saving');
      const questionId = questions[currentQuestionIndex].id;
      const response = responses[questionId] || {};
      
      try {
        // Check if there's already a response for this question
        const { data: existingResponse, error: checkError } = await supabase
          .from("assessment_responses")
          .select("id")
          .eq("submission_id", submissionId)
          .eq("question_id", questionId)
          .maybeSingle();
          
        if (checkError) throw checkError;
        
        if (existingResponse?.id) {
          // Update existing response
          await supabase
            .from("assessment_responses")
            .update({
              personal_response_value: response.personal ?? null,
              work_response_value: response.work ?? null
            })
            .eq("id", existingResponse.id);
        } else {
          // Insert new response
          await supabase
            .from("assessment_responses")
            .insert({
              submission_id: submissionId,
              question_id: questionId,
              personal_response_value: response.personal ?? null,
              work_response_value: response.work ?? null
            });
        }
        
        setSaveStatus('saved');
        
        // Reset save status after a short delay
        setTimeout(() => {
          setSaveStatus('idle');
        }, 1000);
      } catch (error) {
        console.error("Error saving response:", error);
        setSaveStatus('error');
        // Continue with navigation even if saving fails
      }
    }
    
    // Move to the next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // Get the current value for a context
  const getValue = (questionId: string, context: Context): number => {
    return responses[questionId]?.[context] ?? 5; // Default to middle value
  };

  // Calculate PERMA scores and submit the assessment
  const handleSubmit = async () => {
    if (!submissionId || !userId) {
      setError("Cannot submit assessment due to missing data.");
      return;
    }
    
    try {
      // Mark the submission as completed
      await supabase
        .from("assessment_submissions")
        .update({ completed_at: new Date().toISOString() })
        .eq("id", submissionId);
      
      // Fetch all responses for this submission
      const { data: allResponses, error: responsesError } = await supabase
        .from("assessment_responses")
        .select(`
          id,
          question_id,
          personal_response_value,
          work_response_value,
          assessment_questions(category)
        `)
        .eq("submission_id", submissionId);
        
      if (responsesError) throw responsesError;
      
      if (!allResponses || allResponses.length === 0) {
        throw new Error("No responses found for this submission");
      }
      
      // Calculate category scores
      const categories = ["P", "E", "R", "M", "A", "V", "N", "Lon"];
      const contextScores: { [context in Context]: { [category: string]: { sum: number, count: number } } } = {
        personal: {},
        work: {}
      };
      
      // Initialize category counters
      categories.forEach(category => {
        contextScores.personal[category] = { sum: 0, count: 0 };
        contextScores.work[category] = { sum: 0, count: 0 };
      });
      
      // Sum up responses by category and context
      allResponses.forEach(response => {
        // The response from Supabase joins assessment_questions as an array with a single item
        const questionData = Array.isArray(response.assessment_questions) 
          ? response.assessment_questions[0] 
          : response.assessment_questions;
        
        const category = questionData?.category;
        if (!category || !categories.includes(category)) return;
        
        if (response.personal_response_value !== null) {
          contextScores.personal[category].sum += response.personal_response_value;
          contextScores.personal[category].count++;
        }
        
        if (response.work_response_value !== null) {
          contextScores.work[category].sum += response.work_response_value;
          contextScores.work[category].count++;
        }
      });
      
      // Calculate averages and prepare results
      const results = [];
      
      // Calculate individual category scores
      for (const context of ["personal", "work"] as Context[]) {
        for (const category of categories) {
          const { sum, count } = contextScores[context][category];
          if (count > 0) {
            results.push({
              submission_id: submissionId,
              category,
              score: parseFloat((sum / count).toFixed(2)),
              context
            });
          }
        }
        
        // Calculate PERMA overall score (P, E, R, M, A only)
        const permaCategories = ["P", "E", "R", "M", "A"];
        let permaSum = 0;
        let permaCount = 0;
        
        permaCategories.forEach(category => {
          permaSum += contextScores[context][category].sum;
          permaCount += contextScores[context][category].count;
        });
        
        if (permaCount > 0) {
          results.push({
            submission_id: submissionId,
            category: "PERMA_overall",
            score: parseFloat((permaSum / permaCount).toFixed(2)),
            context
          });
        }
      }
      
      // Save all results
      if (results.length > 0) {
        await supabase.from("assessment_results").insert(results);
      }
      
      // Redirect to results page
      router.push(`/results/${submissionId}`);
    } catch (error) {
      console.error("Error submitting assessment:", error);
      setError("Failed to submit assessment. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="max-w-4xl mx-auto p-4">
          <div className="space-y-8">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="max-w-4xl mx-auto p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => router.push("/assessment")}>Go Back</Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (questions.length === 0) {
    return (
      <PageContainer>
        <div className="max-w-4xl mx-auto p-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Questions</AlertTitle>
            <AlertDescription>No assessment questions are available at this time.</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => router.push("/")}>Return Home</Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const QuestionRenderer = getCategoryRenderer(currentQuestion.category);
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = questions.length;
  const progressPercentage = (questionNumber / totalQuestions) * 100;

  // Get category name based on category code
  const getCategoryLabel = (category: string) => {
    const categoryMap: {[key: string]: string} = {
      'P': 'Positive Emotions',
      'E': 'Engagement',
      'R': 'Relationships',
      'M': 'Meaning',
      'A': 'Accomplishment',
      'V': 'Vitality',
      'N': 'Negative Emotions',
      'Lon': 'Loneliness'
    };
    return categoryMap[category] || category;
  };

  // Get badge color based on category
  const getCategoryColor = (category: string) => {
    const colorMap: {[key: string]: string} = {
      'P': 'bg-pink-100 text-pink-800',
      'E': 'bg-amber-100 text-amber-800',
      'R': 'bg-indigo-100 text-indigo-800',
      'M': 'bg-emerald-100 text-emerald-800',
      'A': 'bg-sky-100 text-sky-800',
      'V': 'bg-lime-100 text-lime-800',
      'N': 'bg-red-100 text-red-800',
      'Lon': 'bg-purple-100 text-purple-800'
    };
    return colorMap[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto p-4">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Question {questionNumber} of {totalQuestions}</span>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getCategoryColor(currentQuestion.category)}`}>
              {getCategoryLabel(currentQuestion.category)}
            </span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      
        <div className="space-y-8">
          <h1 className="text-2xl font-bold text-gray-900">{currentQuestion.text}</h1>
          
          <Card className="p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <QuestionRenderer
              id={currentQuestion.id}
              text={currentQuestion.text}
              category={currentQuestion.category}
              personal_context_label={currentQuestion.personal_context_label}
              work_context_label={currentQuestion.work_context_label}
              scale_start={currentQuestion.scale_start}
              scale_end={currentQuestion.scale_end}
              scale_start_label={currentQuestion.scale_start_label}
              scale_end_label={currentQuestion.scale_end_label}
              personal_value={getValue(currentQuestion.id, "personal")}
              work_value={getValue(currentQuestion.id, "work")}
              onValueChange={(context, value) => handleValueChange(currentQuestion.id, context, value)}
            />
          </Card>
          
          {/* Save status indicator */}
          <div className="flex justify-between items-center">
            <div>
              {saveStatus === 'saving' && (
                <span className="text-xs text-amber-600">Saving...</span>
              )}
              {saveStatus === 'saved' && (
                <span className="text-xs text-green-600">Saved!</span>
              )}
              {saveStatus === 'error' && (
                <span className="text-xs text-red-600">Error saving</span>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={goToPrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              
              {currentQuestionIndex < questions.length - 1 ? (
                <Button onClick={goToNextQuestion}>Next</Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit Assessment
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
} 