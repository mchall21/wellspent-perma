"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { addTeamMember } from "@/lib/actions/team";

/**
 * Invite a user to a team
 */
export async function inviteUserToTeam(teamId: string, email: string, role: string = "member") {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { error: "You must be logged in to invite users" };
    }

    // Check if the current user is an admin of this team
    const { data: adminCheck, error: adminError } = await supabase
      .from("team_members")
      .select("*")
      .eq("team_id", teamId)
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (adminError) {
      console.error("Error checking admin status:", adminError);
      return { error: "Failed to verify team permissions" };
    }

    if (!adminCheck) {
      return { error: "You don't have permission to invite users to this team" };
    }

    // Find the user by email
    const { data: userToInvite, error: userLookupError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (userLookupError) {
      console.error("Error looking up user:", userLookupError);
      return { error: "Failed to find user" };
    }

    if (!userToInvite) {
      return { error: "No user found with that email address" };
    }

    // Check if the user is already a member
    const { data: existingMember, error: existingError } = await supabase
      .from("team_members")
      .select("*")
      .eq("team_id", teamId)
      .eq("user_id", userToInvite.id)
      .maybeSingle();

    if (existingError) {
      console.error("Error checking existing membership:", existingError);
      return { error: "Failed to check existing membership" };
    }

    if (existingMember) {
      return { error: "This user is already a member of the team" };
    }

    // Add the user to the team
    const result = await addTeamMember(teamId, userToInvite.id, role);
    
    if (result.error) {
      return result;
    }

    revalidatePath(`/teams/${teamId}`);
    return { success: true, message: "User invited successfully" };
  } catch (error) {
    console.error("Error in inviteUserToTeam:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Search for users by email to invite
 */
export async function searchUsersByEmail(query: string) {
  try {
    if (!query || query.length < 3) {
      return { users: [] };
    }

    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { error: "You must be logged in to search users" };
    }

    // Search for users by email
    const { data, error } = await supabase
      .from("users")
      .select("id, email, name")
      .ilike("email", `%${query}%`)
      .limit(10);

    if (error) {
      console.error("Error searching users:", error);
      return { error: "Failed to search users" };
    }

    return { users: data };
  } catch (error) {
    console.error("Error in searchUsersByEmail:", error);
    return { error: "An unexpected error occurred" };
  }
} 