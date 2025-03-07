"use client";

import { useEffect, useState } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatDistanceToNow, format } from "date-fns";
import { calculateDimensionScores, calculateOverallScores, dimensionMap, colorMap } from "@/lib/utils/chart-utils";

export default function InsightsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    async function fetchData() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          window.location.href = "/auth/signin";
          return;
        }
        
        // Get all submissions
        const { data: submissionsData, error: submissionsError } = await supabase
          .from("assessment_submissions")
          .select("id, created_at")
          .eq("user_id", userData.user.id)
          .order("created_at", { ascending: true });
        
        if (submissionsError) throw submissionsError;
        if (!submissionsData || submissionsData.length === 0) {
          setError("No assessments found. Complete an assessment to see insights.");
          setIsLoading(false);
          return;
        }
        
        // For each submission, get the responses
        const assessmentsWithScores = await Promise.all(
          submissionsData.map(async (submission) => {
            const { data: responsesData, error: responsesError } = await supabase
              .from("assessment_responses")
              .select(`
                *,
                assessment_questions(*)
              `)
              .eq("submission_id", submission.id);
            
            if (responsesError) throw responsesError;
            
            if (responsesData && responsesData.length > 0) {
              const scores = calculateDimensionScores(responsesData);
              const overallScores = calculateOverallScores(scores);
              
              return {
                id: submission.id,
                date: submission.created_at,
                scores,
                overallScores
              };
            }
            
            return null;
          })
        );
        
        // Filter out null values
        const validAssessments = assessmentsWithScores.filter(Boolean);
        setAssessments(validAssessments);
        
        // Format data for trend chart
        const formattedTrendData = validAssessments.map(assessment => {
          const date = new Date(assessment!.date);
          return {
            date: format(date, 'MMM d, yyyy'),
            timestamp: date.getTime(),
            personal: assessment!.overallScores.personal,
            work: assessment!.overallScores.work,
            ...Object.fromEntries(
              assessment!.scores.map(score => [
                score.dimension, 
                (score.personal + score.work) / 2
              ])
            )
          };
        });
        
        setTrendData(formattedTrendData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching your assessment data.");
      } finally {
        setIsLoading(false);
      }
    }

    if (isClient) {
      fetchData();
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
          <p>Loading insights...</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Insights</h1>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center py-8">{error}</p>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Well-being Insights</h1>
          <p className="text-muted-foreground">
            Track your well-being trends over time and see how you're progressing.
          </p>
        </div>

        {trendData.length > 1 ? (
          <Card>
            <CardHeader>
              <CardTitle>Overall Well-being Trends</CardTitle>
              <CardDescription>
                See how your personal and work well-being has changed over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="personal" 
                      name="Personal Life" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="work" 
                      name="Work Life" 
                      stroke="#82ca9d" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Not Enough Data</CardTitle>
              <CardDescription>
                Complete more assessments to see trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="py-4">
                You need at least two assessments to see trend data. Complete another assessment to track your progress over time.
              </p>
            </CardContent>
          </Card>
        )}

        {trendData.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dimension Trends</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(dimensionMap).map(dimension => (
                <Card key={dimension}>
                  <CardHeader>
                    <CardTitle>{dimensionMap[dimension]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={trendData}
                          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                          <YAxis domain={[0, 10]} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey={dimension} 
                            name={dimensionMap[dimension]} 
                            stroke={colorMap[dimension]} 
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Assessment History</h2>
          <div className="space-y-4">
            {assessments.map((assessment, index) => (
              <Card key={assessment.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      Assessment {format(new Date(assessment.date), 'MMMM d, yyyy')}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(assessment.date), { addSuffix: true })}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Personal Life Score</p>
                      <p className="text-2xl font-bold">{assessment.overallScores.personal.toFixed(1)}/10</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Work Life Score</p>
                      <p className="text-2xl font-bold">{assessment.overallScores.work.toFixed(1)}/10</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
} 