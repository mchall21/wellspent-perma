"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [pastAssessments, setPastAssessments] = useState<any[]>([]);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    async function fetchUserData() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          window.location.href = "/auth/signin";
          return;
        }
        
        // Get user profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single();
        
        if (profileData) {
          setUserName(profileData.name || userData.user.email || '');
        } else {
          setUserName(userData.user.email || '');
        }
        
        // Get past assessments
        const { data: submissionsData } = await supabase
          .from("assessment_submissions")
          .select(`
            *,
            assessment_responses(count)
          `)
          .eq("user_id", userData.user.id)
          .order("created_at", { ascending: false });
        
        if (submissionsData) {
          setPastAssessments(submissionsData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isClient) {
      fetchUserData();
    }
  }, [isClient]);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <p>Loading dashboard...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome{userName ? `, ${userName}` : ''}!</h1>
          <p className="text-muted-foreground">
            Track your well-being journey and access your PERMA-V assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-100">
            <CardHeader>
              <CardTitle>Take the PERMA-V Assessment</CardTitle>
              <CardDescription>
                Measure your well-being across six dimensions: Positive emotions, Engagement, Relationships, Meaning, Accomplishment, and Vitality.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                This assessment takes about 10-15 minutes to complete and provides valuable insights into your personal and work well-being.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/assessment" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Start Assessment
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Well-being Stats</CardTitle>
              <CardDescription>
                Track your progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Assessments Completed</p>
                  <p className="text-3xl font-bold">{pastAssessments.length}</p>
                </div>
                {pastAssessments.length > 1 && (
                  <div>
                    <p className="text-sm font-medium">Last Assessment</p>
                    <p className="text-lg">
                      {formatDistanceToNow(new Date(pastAssessments[0].created_at), { addSuffix: true })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/insights" className="w-full">
                <Button variant="outline" className="w-full">
                  View Insights
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {pastAssessments.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Past Assessments</h2>
            <div className="space-y-4">
              {pastAssessments.map((assessment) => (
                <Card key={assessment.id} className="hover:bg-gray-50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        Assessment {new Date(assessment.created_at).toLocaleDateString()}
                      </CardTitle>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(assessment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm">
                      {assessment.assessment_responses.count} questions answered
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex space-x-3 w-full">
                      <Link href={`/results/${assessment.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Results
                        </Button>
                      </Link>
                      <Link href={`/results/${assessment.id}/reflect`} className="flex-1">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Reflect
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>PERMA-V Model</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Learn more about the six dimensions of well-being in the PERMA-V framework.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/perma-v" className="w-full">
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Well-being Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Practical strategies to improve your well-being in each dimension.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/tips" className="w-full">
                  <Button variant="outline" className="w-full">
                    View Tips
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>FAQ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Common questions about the assessment and how to interpret your results.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/faq" className="w-full">
                  <Button variant="outline" className="w-full">
                    View FAQ
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
} 