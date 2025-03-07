"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/database-types";
import { revalidatePath } from "next/cache";

type UserProfile = Database["public"]["Tables"]["users"]["Row"];

export async function updateUserProfile(
  userId: string,
  data: Partial<Omit<UserProfile, "id" | "created_at" | "email" | "role">>
) {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set: () => {}, // Server actions can't set cookies
        remove: () => {}, // Server actions can't remove cookies
      },
    }
  );
  
  const { error } = await supabase
    .from("users")
    .update(data)
    .eq("id", userId);
  
  if (error) {
    throw new Error(error.message);
  }
  
  revalidatePath("/profile");
  return { success: true };
}

export async function getUserById(userId: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set: () => {}, // Server actions can't set cookies
        remove: () => {}, // Server actions can't remove cookies
      },
    }
  );
  
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function getUsersByRole(role: UserProfile["role"]) {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set: () => {}, // Server actions can't set cookies
        remove: () => {}, // Server actions can't remove cookies
      },
    }
  );
  
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", role);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateUserRole(userId: string, role: UserProfile["role"]) {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set: () => {}, // Server actions can't set cookies
        remove: () => {}, // Server actions can't remove cookies
      },
    }
  );
  
  // Check if the current user is an admin
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Not authenticated");
  }
  
  const { data: currentUser } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();
  
  if (!currentUser || currentUser.role !== "admin") {
    throw new Error("Not authorized to update user roles");
  }
  
  // Update the user's role
  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", userId);
  
  if (error) {
    throw new Error(error.message);
  }
  
  revalidatePath("/admin");
  return { success: true };
} 