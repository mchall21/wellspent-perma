"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import Link from "next/link";

const PERMA_CATEGORIES = {
  P: { name: "Positive Emotion", description: "Feelings of joy, contentment, and happiness", color: "#4BC0C0" },
  E: { name: "Engagement", description: "Flow, absorption in activities, and interest", color: "#FF9F40" },
  R: { name: "Relationships", description: "Connection, support, and feeling valued", color: "#36A2EB" },
  M: { name: "Meaning", description: "Purpose, value, and contribution", color: "#9966FF" },
  A: { name: "Accomplishment", description: "Achievement, competence, and progress", color: "#FF6384" },
  V: { name: "Vitality", description: "Physical energy, health, and vigor", color: "#4CAF50" }
};

interface CategoryScore {
  category: string;
  score: number;
  context: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const submissionId = params.submissionId as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [results, setResults] = useState<CategoryScore[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'detailed'>('overview');
  const [submissionDate, setSubmissionDate] = useState<string>('');

  useEffect(() => {
    setIsClient(true);
    
    async function fetchResults() {
      try {
        if (!submissionId) return;
        
        // Get the current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          router.push("/auth/signin");
          return;
        }
        
        // Get the submission details
        const { data: submissionData, error: submissionError } = await supabase
          .from("assessment_submissions")
          .select("*")
          .eq("id", submissionId)
          .eq("user_id", userData.user.id)
          .single();
          
        if (submissionError) {
          throw submissionError;
        }
        
        if (submissionData) {
          setSubmissionDate(submissionData.created_at);
          
          // Get the results for this submission
          const { data: resultsData, error: resultsError } = await supabase
            .from("assessment_results")
            .select("*")
            .eq("submission_id", submissionId)
            .in("category", ['P', 'E', 'R', 'M', 'A', 'V']); // Only get PERMA-V categories
            
          if (resultsError) {
            throw resultsError;
          }
          
          if (resultsData && resultsData.length > 0) {
            setResults(resultsData);
          } else {
            // If no results found, try to calculate them from responses
            const { data: responsesData, error: responsesError } = await supabase
              .from("assessment_responses")
              .select("*, assessment_questions!inner(*)")
              .eq("submission_id", submissionId);
              
            if (responsesError) {
              throw responsesError;
            }
            
            if (responsesData && responsesData.length > 0) {
              // Calculate results from responses
              const calculatedResults: CategoryScore[] = [];
              const categoryScores: Record<string, { personal: { sum: number, count: number }, workplace: { sum: number, count: number } }> = {};
              
              // Group by category and calculate sums
              responsesData.forEach(response => {
                const category = response.assessment_questions.category;
                if (!categoryScores[category]) {
                  categoryScores[category] = {
                    personal: { sum: 0, count: 0 },
                    workplace: { sum: 0, count: 0 }
                  };
                }
                
                if (response.personal_response_value !== null) {
                  categoryScores[category].personal.sum += response.personal_response_value;
                  categoryScores[category].personal.count++;
                }
                
                if (response.work_response_value !== null) {
                  categoryScores[category].workplace.sum += response.work_response_value;
                  categoryScores[category].workplace.count++;
                }
              });
              
              // Calculate averages
              Object.entries(categoryScores).forEach(([category, contexts]) => {
                if (contexts.personal.count > 0) {
                  calculatedResults.push({
                    category,
                    score: contexts.personal.sum / contexts.personal.count,
                    context: 'personal'
                  });
                }
                
                if (contexts.workplace.count > 0) {
                  calculatedResults.push({
                    category,
                    score: contexts.workplace.sum / contexts.workplace.count,
                    context: 'workplace'
                  });
                }
              });
              
              if (calculatedResults.length > 0) {
                setResults(calculatedResults);
              } else {
                setError("No results could be calculated for this assessment.");
              }
            } else {
              setError("No responses found for this assessment.");
            }
          }
        } else {
          setError("Assessment not found.");
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        setError("Failed to load your assessment results.");
      } finally {
        setIsLoading(false);
      }
    }

    if (isClient) {
      fetchResults();
    }
  }, [isClient, submissionId, router]);

  // Format data for radar chart
  const formatRadarData = () => {
    // Group by category
    const categories = {} as Record<string, { name: string, personal: number, workplace: number }>;
    
    results.forEach(result => {
      const category = result.category;
      if (!categories[category]) {
        categories[category] = {
          name: PERMA_CATEGORIES[category as keyof typeof PERMA_CATEGORIES]?.name || category,
          personal: 0,
          workplace: 0
        };
      }
      
      if (result.context === 'personal') {
        categories[category].personal = result.score;
      } else if (result.context === 'workplace') {
        categories[category].workplace = result.score;
      }
    });
    
    return Object.values(categories);
  };

  // Format data for category breakdown
  const getCategoryData = (category: string) => {
    return results.filter(result => result.category === category).map(result => ({
      context: result.context === 'personal' ? 'Personal Life' : 'Work Life',
      score: result.score,
      color: PERMA_CATEGORIES[category as keyof typeof PERMA_CATEGORIES]?.color || '#000000'
    }));
  };

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
          <h1 className="text-3xl font-bold mb-6">Assessment Results</h1>
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
            {error}
          </div>
          <Link href="/results">
            <Button variant="outline">Back to Results</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const radarData = formatRadarData();

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Assessment Results</h1>
          <p className="text-muted-foreground">
            {new Date(submissionDate).toLocaleDateString()} 
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>PERMA-V Profile</CardTitle>
            <CardDescription>
              Compare your personal and work life across all six dimensions of well-being
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis domain={[0, 10]} />
                  <Radar name="Personal Life" dataKey="personal" stroke="#36A2EB" fill="#36A2EB" fillOpacity={0.4} />
                  <Radar name="Work Life" dataKey="workplace" stroke="#FF6384" fill="#FF6384" fillOpacity={0.4} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold">Detailed Breakdown</h2>
          <div className="flex gap-2">
            <Button 
              variant={activeView === 'overview' ? 'default' : 'outline'} 
              onClick={() => setActiveView('overview')}
              size="sm"
            >
              Overview
            </Button>
            <Button 
              variant={activeView === 'detailed' ? 'default' : 'outline'} 
              onClick={() => setActiveView('detailed')}
              size="sm"
            >
              Category Details
            </Button>
          </div>
        </div>

        {activeView === 'overview' ? (
          <div className="grid grid-cols-1 gap-6">
            {Object.entries(PERMA_CATEGORIES).map(([key, { name, description, color }]) => {
              const categoryData = getCategoryData(key);
              return (
                <Card key={key} className="overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-transparent to-transparent" style={{ 
                    backgroundImage: `linear-gradient(to right, ${color}30, ${color})` 
                  }} />
                  <CardHeader className="pb-2">
                    <CardTitle>{name}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="context" />
                          <YAxis domain={[0, 10]} />
                          <Tooltip />
                          <Bar dataKey="score" fill={color} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Tabs defaultValue="P">
            <TabsList className="grid grid-cols-6 mb-6">
              {Object.entries(PERMA_CATEGORIES).map(([key, { name }]) => (
                <TabsTrigger key={key} value={key}>{key}</TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(PERMA_CATEGORIES).map(([key, { name, description, color }]) => {
              const categoryData = getCategoryData(key);
              
              return (
                <TabsContent key={key} value={key}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{name}</CardTitle>
                      <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Your Scores</h3>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" domain={[0, 10]} />
                                <YAxis dataKey="context" type="category" />
                                <Tooltip />
                                <Bar dataKey="score" fill={color} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-4">What This Means</h3>
                          <div className="space-y-4">
                            <p>Your {name.toLowerCase()} score reflects {description.toLowerCase()}.</p>
                            {categoryData.map(data => (
                              <div key={data.context} className="p-4 bg-gray-50 rounded-md">
                                <h4 className="font-medium">{data.context}: {data.score.toFixed(1)}/10</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {data.score >= 8 ? 
                                    `Your ${data.context.toLowerCase()} ${name.toLowerCase()} is excellent! This is a strength you can leverage.` :
                                    data.score >= 6 ?
                                    `Your ${data.context.toLowerCase()} ${name.toLowerCase()} is good. With some attention, you could further enhance this area.` :
                                    `Your ${data.context.toLowerCase()} ${name.toLowerCase()} may benefit from some attention and development.`
                                  }
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        )}
        
        <div className="mt-8 flex justify-between">
          <Link href="/results">
            <Button variant="outline">Back to Results</Button>
          </Link>
          <Link href={`/results/${submissionId}/reflect`}>
            <Button className="bg-green-600 hover:bg-green-700">Reflect on Results</Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
} 