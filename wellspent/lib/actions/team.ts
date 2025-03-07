"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database-types";

type Team = Database["public"]["Tables"]["teams"]["Row"];
type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];

/**
 * Create a new team
 */
export async function createTeam(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name) {
      return { error: "Team name is required" };
    }

    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { error: "You must be logged in to create a team" };
    }

    // Create the team
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({
        name,
        description: description || null,
        created_by: userData.user.id,
      })
      .select()
      .single();

    if (teamError) {
      console.error("Error creating team:", teamError);
      return { error: "Failed to create team" };
    }

    // Add the creator as an admin team member
    const { error: memberError } = await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: userData.user.id,
      role: "admin",
    });

    if (memberError) {
      console.error("Error adding team member:", memberError);
      return { error: "Failed to add you as a team member" };
    }

    revalidatePath("/teams");
    redirect(`/teams/${team.id}`);
  } catch (error) {
    console.error("Error in createTeam:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Update an existing team
 */
export async function updateTeam(teamId: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name) {
      return { error: "Team name is required" };
    }

    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { error: "You must be logged in to update a team" };
    }

    // Check if the user is an admin of this team
    const { data: teamMember, error: memberError } = await supabase
      .from("team_members")
      .select("*")
      .eq("team_id", teamId)
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (memberError) {
      console.error("Error checking team membership:", memberError);
      return { error: "Failed to verify team permissions" };
    }

    if (!teamMember) {
      return { error: "You don't have permission to update this team" };
    }

    // Update the team
    const { error: updateError } = await supabase
      .from("teams")
      .update({
        name,
        description: description || null,
      })
      .eq("id", teamId);

    if (updateError) {
      console.error("Error updating team:", updateError);
      return { error: "Failed to update team" };
    }

    revalidatePath(`/teams/${teamId}`);
    revalidatePath("/teams");
    return { success: true };
  } catch (error) {
    console.error("Error in updateTeam:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Delete a team
 */
export async function deleteTeam(teamId: string) {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { error: "You must be logged in to delete a team" };
    }

    // Check if the user is an admin of this team
    const { data: teamMember, error: memberError } = await supabase
      .from("team_members")
      .select("*")
      .eq("team_id", teamId)
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (memberError) {
      console.error("Error checking team membership:", memberError);
      return { error: "Failed to verify team permissions" };
    }

    if (!teamMember) {
      return { error: "You don't have permission to delete this team" };
    }

    // Delete the team (this will cascade delete team members due to foreign key constraints)
    const { error: deleteError } = await supabase
      .from("teams")
      .delete()
      .eq("id", teamId);

    if (deleteError) {
      console.error("Error deleting team:", deleteError);
      return { error: "Failed to delete team" };
    }

    revalidatePath("/teams");
    redirect("/teams");
  } catch (error) {
    console.error("Error in deleteTeam:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Add a member to a team
 */
export async function addTeamMember(teamId: string, userId: string, role: string = "member") {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { error: "You must be logged in to add team members" };
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
      return { error: "You don't have permission to add members to this team" };
    }

    // Check if the user is already a member
    const { data: existingMember, error: existingError } = await supabase
      .from("team_members")
      .select("*")
      .eq("team_id", teamId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existingError) {
      console.error("Error checking existing membership:", existingError);
      return { error: "Failed to check existing membership" };
    }

    if (existingMember) {
      return { error: "This user is already a member of the team" };
    }

    // Add the new member
    const { error: addError } = await supabase.from("team_members").insert({
      team_id: teamId,
      user_id: userId,
      role,
    });

    if (addError) {
      console.error("Error adding team member:", addError);
      return { error: "Failed to add team member" };
    }

    revalidatePath(`/teams/${teamId}`);
    return { success: true };
  } catch (error) {
    console.error("Error in addTeamMember:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Update a team member's role
 */
export async function updateTeamMemberRole(teamId: string, userId: string, newRole: string) {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { error: "You must be logged in to update team members" };
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
      return { error: "You don't have permission to update members in this team" };
    }

    // Update the member's role
    const { error: updateError } = await supabase
      .from("team_members")
      .update({ role: newRole })
      .eq("team_id", teamId)
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error updating team member:", updateError);
      return { error: "Failed to update team member" };
    }

    revalidatePath(`/teams/${teamId}`);
    return { success: true };
  } catch (error) {
    console.error("Error in updateTeamMemberRole:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Remove a member from a team
 */
export async function removeTeamMember(teamId: string, userId: string) {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { error: "You must be logged in to remove team members" };
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

    if (!adminCheck && userData.user.id !== userId) {
      return { error: "You don't have permission to remove members from this team" };
    }

    // Remove the member
    const { error: removeError } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", teamId)
      .eq("user_id", userId);

    if (removeError) {
      console.error("Error removing team member:", removeError);
      return { error: "Failed to remove team member" };
    }

    revalidatePath(`/teams/${teamId}`);
    
    // If the user removed themselves, redirect to teams page
    if (userData.user.id === userId) {
      redirect("/teams");
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in removeTeamMember:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Get all teams for the current user
 */
export async function getUserTeams() {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { error: "You must be logged in to view teams" };
    }

    // Get all teams the user is a member of
    const { data: teamMembers, error: memberError } = await supabase
      .from("team_members")
      .select("*, teams(*)")
      .eq("user_id", userData.user.id);

    if (memberError) {
      console.error("Error fetching team memberships:", memberError);
      return { error: "Failed to fetch teams" };
    }

    return { teams: teamMembers.map(member => ({ ...member.teams, role: member.role })) };
  } catch (error) {
    console.error("Error in getUserTeams:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Get a specific team by ID
 */
export async function getTeam(teamId: string) {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { error: "You must be logged in to view team details" };
    }

    // Check if the user is a member of this team
    const { data: teamMember, error: memberError } = await supabase
      .from("team_members")
      .select("*")
      .eq("team_id", teamId)
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (memberError) {
      console.error("Error checking team membership:", memberError);
      return { error: "Failed to verify team access" };
    }

    if (!teamMember) {
      return { error: "You don't have access to this team" };
    }

    // Get the team details
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();

    if (teamError) {
      console.error("Error fetching team:", teamError);
      return { error: "Failed to fetch team details" };
    }

    // Get all team members
    const { data: members, error: membersError } = await supabase
      .from("team_members")
      .select("*, users(*)")
      .eq("team_id", teamId);

    if (membersError) {
      console.error("Error fetching team members:", membersError);
      return { error: "Failed to fetch team members" };
    }

    return { 
      team, 
      members: members.map(member => ({
        id: member.id,
        userId: member.user_id,
        role: member.role,
        joinedAt: member.joined_at,
        user: member.users
      })),
      userRole: teamMember.role
    };
  } catch (error) {
    console.error("Error in getTeam:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Search for users to add to a team
 */
export async function searchUsers(query: string) {
  try {
    if (!query || query.length < 3) {
      return { users: [] };
    }

    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { error: "You must be logged in to search users" };
    }

    // Search for users
    const { data: users, error: searchError } = await supabase
      .from("users")
      .select("id, email, name")
      .ilike("email", `%${query}%`)
      .limit(10);

    if (searchError) {
      console.error("Error searching users:", searchError);
      return { error: "Failed to search users" };
    }

    return { users };
  } catch (error) {
    console.error("Error in searchUsers:", error);
    return { error: "An unexpected error occurred" };
  }
} 