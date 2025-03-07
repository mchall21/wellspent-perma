"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberList } from "@/components/teams/member-list";
import { getTeam, deleteTeam } from "@/lib/actions/team";
import { Edit, Trash2, UserPlus, BarChart } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function TeamDetailsPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    async function fetchTeamDetails() {
      try {
        const result = await getTeam(teamId);
        if (result.error) {
          setError(result.error);
        } else {
          setTeam(result.team);
          setMembers(result.members || []);
          setUserRole(result.userRole);
          
          // Get current user ID
          const { data } = await supabase.auth.getUser();
          if (data.user) {
            setUserId(data.user.id);
          }
        }
      } catch (error) {
        console.error("Error fetching team details:", error);
        setError("Failed to load team details");
      } finally {
        setIsLoading(false);
      }
    }

    if (isClient) {
      fetchTeamDetails();
    }
  }, [isClient, teamId]);

  const handleDeleteTeam = async () => {
    if (!team) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteTeam(teamId);
      if (result?.error) {
        toast.error(result.error);
      }
      // The deleteTeam function will redirect on success
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team");
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <p>Loading team details...</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {error}
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={() => router.push("/teams")}>
              Back to Teams
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const isAdmin = userRole === "admin";

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{team.name}</h1>
            <p className="text-muted-foreground">
              {team.description || "No description"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Created: {new Date(team.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-2">
            {isAdmin && (
              <>
                <Link href={`/teams/${teamId}/invite`}>
                  <Button variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Members
                  </Button>
                </Link>
                <Link href={`/teams/${teamId}/edit`}>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Team
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        <Tabs defaultValue="members">
          <TabsList>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="analytics">Team Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="members" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Manage the members of your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MemberList
                  teamId={teamId}
                  members={members}
                  currentUserRole={userRole}
                  currentUserId={userId}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Analytics</CardTitle>
                <CardDescription>
                  View aggregated assessment results for your team
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BarChart className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Team Analytics Coming Soon</h3>
                <p className="text-muted-foreground max-w-md mt-2">
                  This feature is currently under development. Check back soon to view aggregated assessment results for your team.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this team? This action cannot be undone and all team data will be permanently lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeam}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Team"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
} 