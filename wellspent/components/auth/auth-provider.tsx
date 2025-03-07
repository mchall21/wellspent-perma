"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { AuthNav } from "@/components/auth/auth-nav";
import { AuthDebug } from "@/components/auth/auth-debug";

// Define the auth context type
type AuthContextType = {
  isAuthenticated: boolean;
  userRole: string | null;
  userName: string | null;
  userEmail: string | null;
  loading: boolean;
};

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  userName: null,
  userEmail: null,
  loading: true,
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthContextType>({
    isAuthenticated: false,
    userRole: null,
    userName: null,
    userEmail: null,
    loading: true,
  });

  useEffect(() => {
    // Function to get the user profile
    async function getUserProfile(userId: string) {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error getting user profile:", error);
          return null;
        }

        return data;
      } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
      }
    }

    // Function to update auth state
    async function updateAuthState() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setAuthState({
            isAuthenticated: false,
            userRole: null,
            userName: null,
            userEmail: null,
            loading: false,
          });
          return;
        }

        const session = data.session;

        if (!session) {
          setAuthState({
            isAuthenticated: false,
            userRole: null,
            userName: null,
            userEmail: null,
            loading: false,
          });
          return;
        }

        // Get user profile
        const profile = await getUserProfile(session.user.id);

        // Extract user information
        const userRole = profile?.role || session.user.user_metadata?.role;
        const userName = profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0];
        const userEmail = profile?.email || session.user.email;

        setAuthState({
          isAuthenticated: true,
          userRole,
          userName,
          userEmail,
          loading: false,
        });
      } catch (error) {
        console.error("Error updating auth state:", error);
        setAuthState({
          isAuthenticated: false,
          userRole: null,
          userName: null,
          userEmail: null,
          loading: false,
        });
      }
    }

    // Update auth state initially
    updateAuthState();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (!session) {
          setAuthState({
            isAuthenticated: false,
            userRole: null,
            userName: null,
            userEmail: null,
            loading: false,
          });
          return;
        }

        // Get user profile
        const profile = await getUserProfile(session.user.id);

        // Extract user information
        const userRole = profile?.role || session.user.user_metadata?.role;
        const userName = profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0];
        const userEmail = profile?.email || session.user.email;

        setAuthState({
          isAuthenticated: true,
          userRole,
          userName,
          userEmail,
          loading: false,
        });
      }
    );

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Show loading state
  if (authState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Log auth state for debugging
  console.log("Auth state:", authState);

  return (
    <AuthContext.Provider value={authState}>
      <Header 
        isAuthenticated={authState.isAuthenticated}
        userRole={authState.userRole || undefined}
        userName={authState.userName || undefined}
        userEmail={authState.userEmail || undefined}
      />
      <div className="container mt-2">
        <AuthDebug />
      </div>
      <main className="container py-6">{children}</main>
      <Footer />
      {authState.isAuthenticated && <AuthNav />}
    </AuthContext.Provider>
  );
} 