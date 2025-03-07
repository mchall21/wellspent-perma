"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateDimensionScores, generateInsights } from "@/lib/utils/chart-utils";
import Link from "next/link";
import { toast } from "sonner";

export default function ReflectionPage() {
  const params = useParams();
  const submissionId = params.submissionId as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [reflections, setReflections] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedReflections, setSavedReflections] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          fetchResponses();
          fetchExistingReflections();
        } else {
          window.location.href = "/auth/signin";
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setError(`Authentication error: ${JSON.stringify(error)}`);
        setIsLoading(false);
      }
    }

    async function fetchResponses() {
      try {
        const { data, error } = await supabase
          .from("assessment_responses")
          .select(`
            *,
            assessment_questions(*)
          `)
          .eq("submission_id", submissionId);
        
        if (error) {
          throw error;
        }
        
        if (Array.isArray(data) && data.length > 0) {
          // Calculate scores and generate insights
          const scores = calculateDimensionScores(data);
          const generatedInsights = generateInsights(scores);
          setInsights(generatedInsights);
        } else {
          setError("No responses found for this submission.");
        }
      } catch (error) {
        console.error("Error fetching responses:", error);
        setError(`Error fetching responses: ${JSON.stringify(error)}`);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchExistingReflections() {
      try {
        const { data, error } = await supabase
          .from("reflections")
          .select("*")
          .eq("submission_id", submissionId);
        
        if (error) {
          throw error;
        }
        
        if (Array.isArray(data) && data.length > 0) {
          setSavedReflections(data);
          
          // Convert to the format used by the form
          const reflectionsObj: { [key: string]: string } = {};
          data.forEach(reflection => {
            reflectionsObj[reflection.dimension] = reflection.content;
          });
          
          setReflections(reflectionsObj);
        }
      } catch (error) {
        console.error("Error fetching existing reflections:", error);
      }
    }

    if (isClient) {
      checkAuth();
    }
  }, [isClient, submissionId, router]);

  const handleReflectionChange = (dimension: string, value: string) => {
    setReflections(prev => ({
      ...prev,
      [dimension]: value
    }));
  };

  const saveReflections = async () => {
    setIsSaving(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      
      const userId = userData.user.id;
      
      // Convert reflections object to array of objects for insertion
      const reflectionsToSave = Object.entries(reflections)
        .filter(([_, content]) => content.trim() !== "") // Only save non-empty reflections
        .map(([dimension, content]) => ({
          user_id: userId,
          submission_id: submissionId,
          dimension,
          content,
          created_at: new Date().toISOString()
        }));
      
      if (reflectionsToSave.length === 0) {
        toast.error("Please add at least one reflection before saving.");
        setIsSaving(false);
        return;
      }
      
      // Delete existing reflections for this submission
      if (savedReflections.length > 0) {
        const { error: deleteError } = await supabase
          .from("reflections")
          .delete()
          .eq("submission_id", submissionId);
        
        if (deleteError) {
          throw deleteError;
        }
      }
      
      // Insert new reflections
      const { error: insertError } = await supabase
        .from("reflections")
        .insert(reflectionsToSave);
      
      if (insertError) {
        throw insertError;
      }
      
      toast.success("Your reflections have been saved successfully!");
      
      // Update saved reflections state
      setSavedReflections(reflectionsToSave);
      
    } catch (error) {
      console.error("Error saving reflections:", error);
      toast.error("Failed to save reflections. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <p className="text-red-500 font-medium">Error: {error}</p>
          <button 
            onClick={() => window.location.href = "/"}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Go Back
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reflect on Your Results</h1>
          <p className="text-muted-foreground">
            Take some time to reflect on your PERMA-V assessment results. What do these insights mean for your well-being?
          </p>
        </div>

        <div className="space-y-6">
          {insights.map((insight, index) => (
            <Card key={index} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">{insight.dimension}</CardTitle>
                <CardDescription>
                  {insight.type === 'strength' 
                    ? 'This appears to be a strength area for you.' 
                    : insight.type === 'opportunity' 
                    ? 'This may be an area for growth and development.'
                    : 'Consider how to balance these aspects of your life.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg mb-4 ${
                  insight.type === 'strength' 
                    ? 'bg-green-50 border border-green-200' 
                    : insight.type === 'opportunity' 
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}>
                  <p>{insight.text}</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor={`reflection-${index}`} className="block font-medium">
                    Your Reflection
                  </label>
                  <Textarea
                    id={`reflection-${index}`}
                    placeholder="What does this insight mean to you? How might you apply this to improve your well-being?"
                    rows={4}
                    value={reflections[insight.dimension] || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleReflectionChange(insight.dimension, e.target.value)}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between pt-6">
          <Link href={`/results/${submissionId}`}>
            <Button variant="outline">
              Back to Results
            </Button>
          </Link>
          <Button 
            onClick={saveReflections} 
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? 'Saving...' : 'Save Reflections'}
          </Button>
        </div>

        <div className="pt-8 pb-12">
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
              <CardDescription>
                Continue your well-being journey with these next steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Now that you've reflected on your PERMA-V assessment results, consider taking action to improve your well-being:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Set specific, achievable goals based on your areas for growth</li>
                <li>Schedule regular check-ins to track your progress</li>
                <li>Share your insights with trusted friends, family, or colleagues</li>
                <li>Retake the assessment in 1-3 months to see how you've improved</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard" className="w-full">
                <Button className="w-full">Return to Dashboard</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
} 