"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PageContainer } from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";

export default function TestDbPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [testResults, setTestResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Test the Supabase client
      console.log("Testing Supabase connection...");
      console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log("Has Anon Key:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      
      // Test querying the assessment_questions table
      console.log("Querying assessment_questions table...");
      const { data: questions, error: questionsError } = await supabase
        .from("assessment_questions")
        .select("*")
        .limit(5);
      
      console.log("Questions query result:", { data: questions, error: questionsError });
      
      // Test authentication
      console.log("Testing authentication...");
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      console.log("Auth result:", { data: authData, error: authError });
      
      // Compile results
      const results = {
        timestamp: new Date().toISOString(),
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        questions: {
          data: questions,
          error: questionsError,
        },
        auth: {
          session: authData?.session ? "Session exists" : "No session",
          error: authError,
        },
      };
      
      setTestResults(results);
    } catch (err) {
      console.error("Error testing connection:", err);
      setError(`Error testing connection: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Database Connection Test</h1>
        
        <div className="space-y-4">
          <Button 
            onClick={testConnection} 
            disabled={isLoading}
          >
            {isLoading ? "Testing..." : "Test Connection"}
          </Button>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
              {error}
            </div>
          )}
          
          {testResults && (
            <div className="bg-white border rounded-md p-4 overflow-auto">
              <h2 className="text-xl font-bold mb-4">Test Results</h2>
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
} 