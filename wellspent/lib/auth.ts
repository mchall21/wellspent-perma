"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Database } from "./database-types";
import { cache } from "react";

// Check if we're in build/generate phase to avoid cookie access
const isBuildTime = () => {
  return process.env.NEXT_PHASE === 'phase-production-build';
};

// Create a cached server client to avoid multiple instances
export const createClient = cache(() => {
  if (isBuildTime()) {
    // Return a dummy client during build
    return null;
  }
  
  try {
    const cookieStore = cookies();
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            const cookie = cookieStore.get(name);
            return cookie?.value;
          },
          set() {
            // Server components can't set cookies
          },
          remove() {
            // Server components can't remove cookies
          },
        },
      }
    );
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    return null;
  }
});

// Get the user session
export async function getSession() {
  try {
    // Skip during build time
    if (isBuildTime()) {
      return null;
    }
    
    const supabase = createClient();
    if (!supabase) return null;
    
    // Get session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting session:", error);
      return null;
    }
    
    return data.session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

// Get the user profile
export async function getUserProfile() {
  try {
    // Skip during build time
    if (isBuildTime()) {
      return null;
    }
    
    const session = await getSession();
    if (!session) {
      return null;
    }
    
    const supabase = createClient();
    if (!supabase) return null;
    
    // Get user profile
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
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

// Require authentication or redirect to sign in
export async function requireAuth() {
  // Skip during build time
  if (isBuildTime()) {
    return null;
  }
  
  const session = await getSession();
  if (!session) {
    redirect("/auth/signin");
  }
  return session;
}

// Require admin role or redirect
export async function requireAdmin() {
  // Skip during build time
  if (isBuildTime()) {
    return { session: null, profile: null };
  }
  
  const session = await getSession();
  if (!session) {
    redirect("/auth/signin");
  }
  
  const profile = await getUserProfile();
  if (!profile || profile.role.toLowerCase() !== "admin") {
    redirect("/");
  }
  
  return { session, profile };
}

// Require coach role or redirect
export async function requireCoach() {
  // Skip during build time
  if (isBuildTime()) {
    return { session: null, profile: null };
  }
  
  const session = await getSession();
  if (!session) {
    redirect("/auth/signin");
  }
  
  const profile = await getUserProfile();
  const role = profile?.role?.toLowerCase();
  if (!profile || (role !== "coach" && role !== "admin")) {
    redirect("/");
  }
  
  return { session, profile };
} 