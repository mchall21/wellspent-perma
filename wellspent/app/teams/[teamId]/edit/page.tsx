"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamForm } from "@/components/teams/team-form";
import { getTeam } from "@/lib/actions/team";
import { supabase } from "@/lib/supabase";

export default function EditTeamPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [team, setTeam] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    async function fetchTeam() {
      try {
        const result = await getTeam(teamId);
        if (result.error) {
          setError(result.error);
        } else if (result.userRole !== "admin") {
          setError("You don't have permission to edit this team");
        } else {
          setTeam(result.team);
        }
      } catch (error) {
        console.error("Error fetching team:", error);
        setError("Failed to load team details");
      } finally {
        setIsLoading(false);
      }
    }

    if (isClient) {
      fetchTeam();
    }
  }, [isClient, teamId]);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {error}
          </div>
          <div className="mt-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Go Back
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Team</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Team Details</CardTitle>
            <CardDescription>
              Update your team information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TeamForm
              teamId={teamId}
              initialData={{
                name: team.name,
                description: team.description || "",
              }}
              isEditing={true}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
} 