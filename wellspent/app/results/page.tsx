"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  ResponsiveContainer,
  Tooltip
} from "recharts";

const PERMA_CATEGORIES = {
  P: { name: "Positive Emotion", description: "Feelings of joy, contentment, and happiness" },
  E: { name: "Engagement", description: "Flow, absorption in activities, and interest" },
  R: { name: "Relationships", description: "Connection, support, and feeling valued" },
  M: { name: "Meaning", description: "Purpose, value, and contribution" },
  A: { name: "Accomplishment", description: "Achievement, competence, and progress" },
  V: { name: "Vitality", description: "Physical energy, health, and vigor" }
};

interface CategoryScore {
  category: string;
  score: number;
  context: string;
}

interface SubmissionWithCount {
  id: string;
  created_at: string;
  completed_at?: string;
  assessment_responses: {
    count: number;
  }[];
}

export default function ResultsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionWithCount[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    async function fetchSubmissions() {
      try {
        // Get the current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          router.push("/auth/signin");
          return;
        }
        
        // Get all submissions for the user
        const { data, error: submissionsError } = await supabase
          .from("assessment_submissions")
          .select(`
            id,
            created_at,
            completed_at,
            assessment_responses:assessment_responses(count)
          `)
          .eq("user_id", userData.user.id)
          .order("created_at", { ascending: false });
        
        if (submissionsError) {
          throw submissionsError;
        }
        
        if (data && data.length > 0) {
          setSubmissions(data);
          
          // If there's only one submission, redirect directly to it
          if (data.length === 1) {
            router.push(`/results/${data[0].id}`);
          }
        } else {
          setError("No completed assessments found. Please complete an assessment first.");
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setError("Failed to load your assessment results.");
      } finally {
        setIsLoading(false);
      }
    }

    if (isClient) {
      fetchSubmissions();
    }
  }, [isClient, router]);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <p>Loading your results...</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Assessment Results</h1>
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
            {error}
          </div>
          <Link href="/assessment">
            <Button>Take Assessment</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Assessment Results</h1>
        
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    Assessment {new Date(submission.created_at).toLocaleDateString()}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">
                  {submission.assessment_responses && submission.assessment_responses.length > 0 
                    ? submission.assessment_responses[0].count 
                    : 0} questions answered
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex space-x-3 w-full">
                  <Link href={`/results/${submission.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Results
                    </Button>
                  </Link>
                  <Link href={`/results/${submission.id}/reflect`} className="flex-1">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Reflect
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/assessment">
            <Button variant="outline">Take Another Assessment</Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}