"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";
import { StartAssessment } from "@/components/assessment/start-assessment";
import { supabase } from "@/lib/supabase";

export default function AssessmentPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true when component mounts (client-side only)
    setIsClient(true);
    
    async function checkAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth:", error);
          router.push("/auth/signin");
          return;
        }
        
        if (!data.session) {
          console.log("No active session found, redirecting to sign in");
          router.push("/auth/signin");
          return;
        }
        
        // Verify the session is valid by getting the user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          console.error("Error getting user or no user found:", userError);
          router.push("/auth/signin");
          return;
        }
        
        console.log("User authenticated:", userData.user.email);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Unexpected error during auth check:", error);
        router.push("/auth/signin");
      } finally {
        setIsLoading(false);
      }
    }

    if (isClient) {
      checkAuth();
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
          <p>Loading...</p>
        </div>
      </PageContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <p>You must be signed in to access this page. Redirecting...</p>
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