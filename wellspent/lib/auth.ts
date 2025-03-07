"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Database } from "./database-types";

// Get the user session
export async function getSession() {
  try {
    // Create Supabase client with properly awaited cookies
    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
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
    const session = await getSession();
    
    if (!session) {
      return null;
    }
    
    // Create Supabase client with properly awaited cookies
    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
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
  const session = await getSession();
  if (!session) {
    redirect("/auth/signin");
  }
  return session;
}

// Require admin role or redirect
export async function requireAdmin() {
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