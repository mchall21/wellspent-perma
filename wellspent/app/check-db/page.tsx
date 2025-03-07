"use client";

import { useEffect, useState } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function CheckDbPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [sqlQuery, setSqlQuery] = useState<string>(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
  );

  const runQuery = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/run-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: sqlQuery }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        setError(data.error || "Failed to run query");
      } else {
        setTestResults(data);
      }
    } catch (err) {
      console.error("Error running query:", err);
      setError(`Error running query: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSchema = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/check-schema");
      const data = await response.json();
      
      if (!data.success) {
        setError(data.error || "Failed to check schema");
      } else {
        setTestResults(data);
      }
    } catch (err) {
      console.error("Error checking schema:", err);
      setError(`Error checking schema: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Database Schema Check</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Run SQL Query</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              rows={5}
              className="font-mono"
            />
            
            <Button 
              onClick={runQuery} 
              disabled={isLoading}
            >
              {isLoading ? "Running..." : "Run Query"}
            </Button>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Button 
            onClick={checkSchema} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? "Checking..." : "Check Schema"}
          </Button>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
              {error}
            </div>
          )}
          
          {testResults && (
            <div className="bg-white border rounded-md p-4 overflow-auto">
              <h2 className="text-xl font-bold mb-4">Results</h2>
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