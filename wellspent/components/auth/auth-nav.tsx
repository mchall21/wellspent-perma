"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export function AuthNav() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true when component mounts (client-side only)
    setIsClient(true);
    
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-0 w-full z-50 pointer-events-none">
      <div className="container mx-auto px-4 pb-4 flex justify-end">
        <a href="/assessment" className="pointer-events-auto">
          <Button className="bg-green-600 hover:bg-green-700 shadow-lg">
            Start Assessment
          </Button>
        </a>
      </div>
    </div>
  );
} 