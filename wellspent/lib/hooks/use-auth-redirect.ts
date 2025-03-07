"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function useAuthRedirect(redirectTo: string = "/assessment") {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and redirect if needed
    const checkAuthAndRedirect = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("User is authenticated, redirecting to:", redirectTo);
          router.push(redirectTo);
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        
        if (session && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")) {
          console.log("User signed in, redirecting to:", redirectTo);
          router.push(redirectTo);
        }
      }
    );

    // Check auth state on mount
    checkAuthAndRedirect();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [router, redirectTo]);
} 