"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  HeartIcon, 
  BriefcaseIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// Define types
type Context = "personal" | "work";
type ResponseValue = number;

interface Response {
  [questionId: string]: {
    personal?: ResponseValue;
    work?: ResponseValue;
  };
}

interface QuestionComponentProps {
  questionId: string;
  text: string;
  personalContextLabel: string;
  workContextLabel: string;
  scaleStartLabel: string;
  scaleEndLabel: string;
  onValueChange: (questionId: string, context: Context, value: ResponseValue) => void;
  getValue: (questionId: string, context: Context) => number;
}

interface Question {
  id: string;
  category: string;
  text: string;
  personalContextLabel: string;
  workContextLabel: string;
  scaleStartLabel: string;
  scaleEndLabel: string;
  scaleStart: number;
  scaleEnd: number;
}

// Standard question component for all questions
const QuestionComponent = ({ 
  questionId, 
  text,
  personalContextLabel,
  workContextLabel,
  scaleStartLabel,
  scaleEndLabel,
  onValueChange,
  getValue
}: QuestionComponentProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="rounded-xl border p-4 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="flex items-center mb-4">
        <HeartIcon className="mr-2 h-5 w-5 text-blue-600" />
        <span className="font-medium text-blue-800">{personalContextLabel}</span>
      </div>
      
      <div className="space-y-3">
        <Slider 
          defaultValue={[getValue(questionId, "personal")]} 
          max={10} 
          step={1}
          className="py-4" 
          onValueChange={(value) => onValueChange(questionId, "personal", value[0])}
        />
        <div className="flex justify-between text-sm">
          <div className="text-xs text-blue-700">{scaleStartLabel}</div>
          <div className="text-xs text-blue-700">{scaleEndLabel}</div>
        </div>
      </div>
    </div>
    
    <div className="rounded-xl border p-4 bg-gradient-to-r from-violet-50 to-violet-100">
      <div className="flex items-center mb-4">
        <BriefcaseIcon className="mr-2 h-5 w-5 text-violet-600" />
        <span className="font-medium text-violet-800">{workContextLabel}</span>
      </div>
      
      <div className="space-y-3">
        <Slider 
          defaultValue={[getValue(questionId, "work")]} 
          max={10} 
          step={1}
          className="py-4" 
          onValueChange={(value) => onValueChange(questionId, "work", value[0])}
        />
        <div className="flex justify-between text-sm">
          <div className="text-xs text-violet-700">{scaleStartLabel}</div>
          <div className="text-xs text-violet-700">{scaleEndLabel}</div>
        </div>
      </div>
    </div>
  </div>
);

export default function AssessmentQuestions() {
  // State to store all responses
  const [responses, setResponses] = useState<Response>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load questions from the first file
  useEffect(() => {
    // Questions adapted from the first file
    const permavQuestions: Question[] = [
      // POSITIVE EMOTIONS (P)
      {
        id: "joy",
        category: "P",
        text: "How often do you experience genuine joy or contentment?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Rarely",
        scaleEndLabel: "Very often",
        scaleStart: 0,
        scaleEnd: 10
      },
      {
        id: "optimism",
        category: "P",
        text: "How optimistic are you about your future?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Not optimistic",
        scaleEndLabel: "Very optimistic",
        scaleStart: 0,
        scaleEnd: 10
      },
      {
        id: "gratitude",
        category: "P",
        text: "How often do you feel grateful for aspects of your life?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Rarely",
        scaleEndLabel: "Very often",
        scaleStart: 0,
        scaleEnd: 10
      },
      
      // ENGAGEMENT (E)
      {
        id: "flow",
        category: "E",
        text: "How often do you lose track of time because you're completely absorbed in what you're doing?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Time drags",
        scaleEndLabel: "Time flies",
        scaleStart: 0,
        scaleEnd: 10
      },
      {
        id: "absorbed_interest",
        category: "E",
        text: "When doing activities, how deeply engaged do you typically become?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Easily distracted",
        scaleEndLabel: "Completely immersed",
        scaleStart: 0,
        scaleEnd: 10
      },
      {
        id: "flow_channel",
        category: "E",
        text: "How well do your challenges match your skills and abilities?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Poor match",
        scaleEndLabel: "Perfect match",
        scaleStart: 0,
        scaleEnd: 10
      },
      
      // RELATIONSHIPS (R)
      {
        id: "social_support",
        category: "R",
        text: "How supported do you feel by the people around you?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Not supported",
        scaleEndLabel: "Very supported",
        scaleStart: 0,
        scaleEnd: 10
      },
      {
        id: "connection_quality",
        category: "R",
        text: "How strong are your connections with the important people in your life?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Distant",
        scaleEndLabel: "Close",
        scaleStart: 0,
        scaleEnd: 10
      },
      {
        id: "psychological_safety",
        category: "R",
        text: "How safe do you feel being your authentic self with others?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Unsafe",
        scaleEndLabel: "Completely safe",
        scaleStart: 0,
        scaleEnd: 10
      },
      {
        id: "social_connection",
        category: "R",
        text: "How connected do you feel to others around you?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Disconnected",
        scaleEndLabel: "Deeply connected",
        scaleStart: 0,
        scaleEnd: 10
      },
      
      // MEANING (M)
      {
        id: "purpose",
        category: "M",
        text: "How clear is your sense of purpose and direction?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Uncertain",
        scaleEndLabel: "Clear direction",
        scaleStart: 0,
        scaleEnd: 10
      },
      {
        id: "contribution_value",
        category: "M",
        text: "How much do you feel what you do matters and makes a difference?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Minimal impact",
        scaleEndLabel: "Significant impact",
        scaleStart: 0,
        scaleEnd: 10
      },
      {
        id: "values_alignment",
        category: "M",
        text: "How aligned are your daily activities with your core values?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Misaligned",
        scaleEndLabel: "Perfectly aligned",
        scaleStart: 0,
        scaleEnd: 10
      },
      {
        id: "lasting_impact",
        category: "M",
        text: "How much lasting impact do you feel your efforts will have?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Limited impact",
        scaleEndLabel: "Lasting legacy",
        scaleStart: 0,
        scaleEnd: 10
      },
      
      // ACCOMPLISHMENT (A)
      {
        id: "goal_achievement",
        category: "A",
        text: "How often do you achieve the important goals you set for yourself?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Rarely",
        scaleEndLabel: "Very often",
        scaleStart: 0,
        scaleEnd: 10
      },
      {
        id: "competence",
        category: "A",
        text: "How competent do you feel in the activities that are important to you?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Beginner",
        scaleEndLabel: "Expert",
        scaleStart: 0,
        scaleEnd: 10
      },
      {
        id: "growth_mindset",
        category: "A",
        text: "How much do you embrace challenges as opportunities to learn and grow?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Fixed mindset",
        scaleEndLabel: "Growth mindset",
        scaleStart: 0,
        scaleEnd: 10
      },
      
      // VITALITY (V)
      {
        id: "energy_levels",
        category: "V",
        text: "How would you rate your energy levels throughout a typical day?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Drained",
        scaleEndLabel: "Energized",
        scaleStart: 0,
        scaleEnd: 10
      },
      {
        id: "physical_wellbeing",
        category: "V",
        text: "How satisfied are you with your physical health and well-being?",
        personalContextLabel: "Personal Life",
        workContextLabel: "Work Life",
        scaleStartLabel: "Unsatisfied",
        scaleEndLabel: "Very satisfied",
        scaleStart: 0,
        scaleEnd: 10
      },
      {
        id: "work_life_balance",
        category: "V",
        text: "How satisfied are you with your work-life balance?",
        personalContextLabel: "Personal Satisfaction",
        workContextLabel: "Work Satisfaction",
        scaleStartLabel: "Unsatisfied",
        scaleEndLabel: "Very satisfied",
        scaleStart: 0,
        scaleEnd: 10
      }
    ];

    setQuestions(permavQuestions);
    setLoading(false);
  }, []);

  // Update response values
  const handleValueChange = (questionId: string, context: Context, value: ResponseValue) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [context]: value
      }
    }));
  };

  // Navigate between questions
  const goToNextQuestion = () => {
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

  // Get current response values
  const getValue = (questionId: string, context: Context): number => {
    return responses[questionId]?.[context] ?? 5;
  };

  // Submit the assessment
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get the current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        setError("You must be logged in to submit an assessment.");
        console.error("Authentication error:", userError);
        return;
      }
      
      console.log("Submitting assessment for user:", userData.user.id);
      
      // Create a submission record
      const { data: submissionData, error: submissionError } = await supabase
        .from("assessment_submissions")
        .insert({
          user_id: userData.user.id,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (submissionError || !submissionData) {
        console.error("Error creating submission:", submissionError);
        throw new Error(`Error creating submission: ${submissionError?.message || "Unknown error"}`);
      }
      
      console.log("Created submission:", submissionData);
      
      // Format data for submission to assessment_response table (singular)
      const formattedResponsesSingular = Object.entries(responses).map(([questionId, contextValues]) => ({
        submission_id: submissionData.id,
        question_id: questionId,
        personal_response_value: contextValues.personal || 5,
        work_response_value: contextValues.work || 5
      }));
      
      // Insert into assessment_response table (singular)
      const { error: responsesSingularError } = await supabase
        .from("assessment_response")
        .insert(formattedResponsesSingular);
      
      if (responsesSingularError) {
        console.error("Error saving to assessment_response:", responsesSingularError);
        console.log("Trying alternative table...");
      } else {
        console.log("Successfully saved to assessment_response table");
      }
      
      // Also format for assessment_responses table (plural) which has a different structure
      interface PluralResponse {
        submission_id: string;
        question_id: string;
        score: number;
        context: 'personal' | 'work';
      }
      
      const formattedResponsesPlural: PluralResponse[] = [];
      
      // Add personal context responses
      Object.entries(responses).forEach(([questionId, contextValues]) => {
        // Add personal context
        formattedResponsesPlural.push({
          submission_id: submissionData.id,
          question_id: questionId,
          score: contextValues.personal || 5,
          context: 'personal'
        });
        
        // Add work context
        formattedResponsesPlural.push({
          submission_id: submissionData.id,
          question_id: questionId,
          score: contextValues.work || 5,
          context: 'work'
        });
      });
      
      // Insert into assessment_responses table (plural)
      const { error: responsesPluralError } = await supabase
        .from("assessment_responses")
        .insert(formattedResponsesPlural);
      
      if (responsesPluralError) {
        console.error("Error saving to assessment_responses:", responsesPluralError);
        
        // If both inserts failed, throw an error
        if (responsesSingularError) {
          throw new Error(`Failed to save responses to either table: ${responsesPluralError.message}`);
        }
      } else {
        console.log("Successfully saved to assessment_responses table");
      }
      
      // Calculate PERMA-V scores
      // Group questions by category and calculate average scores
      interface CategoryScore {
        personal: { sum: number; count: number };
        workplace: { sum: number; count: number };
      }
      
      const categoryScores: Record<string, CategoryScore> = {};
      
      // Get all questions to access their categories
      const questionsWithCategories = questions.map(q => ({
        id: q.id,
        category: q.category
      }));
      
      // Calculate scores for each category and context
      for (const [questionId, contextValues] of Object.entries(responses)) {
        const question = questionsWithCategories.find(q => q.id === questionId);
        if (!question) continue;
        
        const category = question.category;
        if (!categoryScores[category]) {
          categoryScores[category] = {
            personal: { sum: 0, count: 0 },
            workplace: { sum: 0, count: 0 }
          };
        }
        
        if (contextValues.personal !== undefined) {
          categoryScores[category].personal.sum += contextValues.personal;
          categoryScores[category].personal.count++;
        }
        
        if (contextValues.work !== undefined) {
          categoryScores[category].workplace.sum += contextValues.work;
          categoryScores[category].workplace.count++;
        }
      }
      
      // Calculate averages and format for database
      const resultsToInsert = [];
      
      for (const [category, contexts] of Object.entries(categoryScores)) {
        if (contexts.personal.count > 0) {
          resultsToInsert.push({
            submission_id: submissionData.id,
            category,
            score: contexts.personal.sum / contexts.personal.count,
            context: 'personal'
          });
        }
        
        if (contexts.workplace.count > 0) {
          resultsToInsert.push({
            submission_id: submissionData.id,
            category,
            score: contexts.workplace.sum / contexts.workplace.count,
            context: 'workplace'
          });
        }
      }
      
      // Calculate overall PERMA score
      const permaCategories = ['P', 'E', 'R', 'M', 'A'];
      const personalPermaScores = permaCategories
        .filter(cat => categoryScores[cat]?.personal?.count > 0)
        .map(cat => categoryScores[cat].personal.sum / categoryScores[cat].personal.count);
      
      const workplacePermaScores = permaCategories
        .filter(cat => categoryScores[cat]?.workplace?.count > 0)
        .map(cat => categoryScores[cat].workplace.sum / categoryScores[cat].workplace.count);
      
      if (personalPermaScores.length > 0) {
        const personalPermaAvg = personalPermaScores.reduce((sum, score) => sum + score, 0) / personalPermaScores.length;
        resultsToInsert.push({
          submission_id: submissionData.id,
          category: 'PERMA_overall',
          score: personalPermaAvg,
          context: 'personal'
        });
      }
      
      if (workplacePermaScores.length > 0) {
        const workplacePermaAvg = workplacePermaScores.reduce((sum, score) => sum + score, 0) / workplacePermaScores.length;
        resultsToInsert.push({
          submission_id: submissionData.id,
          category: 'PERMA_overall',
          score: workplacePermaAvg,
          context: 'workplace'
        });
      }
      
      // Insert results
      if (resultsToInsert.length > 0) {
        const { error: resultsError } = await supabase
          .from("assessment_results")
          .insert(resultsToInsert);
        
        if (resultsError) {
          console.error("Error saving results:", resultsError);
          // Continue anyway since the responses are saved
        }
      }
      
      // If we got here, the submission was successful
      console.log("Assessment submitted successfully!");
      router.push("/assessment/complete");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <p>Loading assessment questions...</p>
        </div>
      </PageContainer>
    );
  }

  // Get current question
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">PERMA-V Assessment</h1>
          <p className="text-muted-foreground">
            Answer the following questions about your personal and work life
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round((currentQuestionIndex / (questions.length - 1)) * 100)}% complete</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${(currentQuestionIndex / (questions.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Question */}
        <Card className="mb-8 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-primary/10 text-primary font-medium rounded-full w-8 h-8 flex items-center justify-center mr-3">
              {currentQuestion.category}
            </div>
            <h2 className="text-xl font-bold">
              {currentQuestion.text}
            </h2>
          </div>
          
          {/* Question component */}
          <div className="mb-6">
            <QuestionComponent 
              questionId={currentQuestion.id}
              text={currentQuestion.text}
              personalContextLabel={currentQuestion.personalContextLabel}
              workContextLabel={currentQuestion.workContextLabel}
              scaleStartLabel={currentQuestion.scaleStartLabel}
              scaleEndLabel={currentQuestion.scaleEndLabel}
              onValueChange={handleValueChange}
              getValue={getValue}
            />
          </div>
        </Card>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded">
            {error}
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={goToPrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={goToNextQuestion}>
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Complete Assessment"}
            </Button>
          )}
        </div>
      </div>
    </PageContainer>
  );
}