"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";
import { StartAssessment } from "@/components/assessment/start-assessment";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AssessmentPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Set isClient to true when component mounts (client-side only)
    setIsClient(true);
    
    async function checkAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth:", error);
          setAuthError("Error checking authentication status. Please try again.");
          return;
        }
        
        if (!data.session) {
          console.log("No active session found, redirecting to sign in");
          // Don't redirect automatically, let the user see the message
          setAuthError("You need to sign in to access the assessment.");
          return;
        }
        
        // Verify the session is valid by getting the user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          console.error("Error getting user or no user found:", userError);
          setAuthError("Error verifying your account. Please sign in again.");
          return;
        }
        
        console.log("User authenticated:", userData.user.email);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Unexpected error during auth check:", error);
        setAuthError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    if (isClient) {
      checkAuth();
    }
  }, [isClient]);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4">Loading assessment...</p>
        </div>
      </PageContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <p className="text-red-500">{authError || "You must be signed in to access this page."}</p>
          <button 
            onClick={() => router.push("/auth/signin")}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Sign In
          </button>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <StartAssessment />
        
        {/* Debug link */}
        <div className="mt-8 text-center">
          <a 
            href="/debug" 
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Database Debug
          </a>
        </div>
      </div>
    </PageContainer>
  );
} 