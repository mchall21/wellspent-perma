"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Database } from "./database-types";

// Skip during build/static generation
const PHASE = process.env.NEXT_PHASE;
const IS_BUILD = PHASE === 'phase-production-build';

// Get the user session
export async function getSession() {
  // Skip auth during build/static generation
  if (IS_BUILD) {
    return null;
  }

  try {
    // Simple try-catch to handle any cookie issues
    let cookieStore;
    try {
      cookieStore = cookies();
    } catch (e) {
      console.error("Error accessing cookies:", e);
      return null;
    }

    // Create the supabase client
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            try {
              return cookieStore.get(name)?.value;
            } catch (e) {
              return undefined;
            }
          },
          set() {}, // Not used in server components
          remove() {}, // Not used in server components
        },
      }
    );

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
  // Skip during build/static generation
  if (IS_BUILD) {
    return null;
  }

  try {
    const session = await getSession();
    if (!session) {
      return null;
    }

    // Simple try-catch to handle any cookie issues
    let cookieStore;
    try {
      cookieStore = cookies();
    } catch (e) {
      console.error("Error accessing cookies:", e);
      return null;
    }

    // Create the supabase client
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            try {
              return cookieStore.get(name)?.value;
            } catch (e) {
              return undefined;
            }
          },
          set() {}, // Not used in server components
          remove() {}, // Not used in server components
        },
      }
    );

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
  // Skip during build/static generation
  if (IS_BUILD) {
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
  // Skip during build/static generation
  if (IS_BUILD) {
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
  // Skip during build/static generation
  if (IS_BUILD) {
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