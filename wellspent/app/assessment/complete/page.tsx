"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CompletePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [latestSubmissionId, setLatestSubmissionId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth/signin");
        return;
      }
      
      // Fetch the latest submission for this user
      try {
        const { data: submissions, error } = await supabase
          .from("assessment_submissions")
          .select("id")
          .eq("user_id", data.session.user.id)
          // Don't filter by completed status if the field doesn't exist
          // .eq("completed", true)
          .order("created_at", { ascending: false })
          .limit(1);
        
        if (error) {
          console.error("Error fetching submission:", error);
        } else if (submissions && submissions.length > 0) {
          setLatestSubmissionId(submissions[0].id);
        }
      } catch (error) {
        console.error("Error:", error);
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    }

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </PageContainer>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Assessment Complete!</h1>
          <p className="text-muted-foreground">
            Thank you for completing the PERMA-V assessment.
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-4">
          <p>
            Your responses have been recorded. You can now view your results to see your
            PERMA-V profile and gain insights into your well-being.
          </p>
          <p>
            The results page will show you how you scored across the six dimensions of
            well-being, comparing your personal and work experiences.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          {latestSubmissionId ? (
            <Link href={`/results/${latestSubmissionId}`}>
              <Button>View Your Results</Button>
            </Link>
          ) : (
            <Link href="/results">
              <Button>View Your Results</Button>
            </Link>
          )}
          <Link href="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
} 