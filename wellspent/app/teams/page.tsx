"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserTeams } from "@/lib/actions/team";
import { PlusCircle, Users } from "lucide-react";

export default function TeamsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    async function fetchTeams() {
      try {
        const result = await getUserTeams();
        if (result.error) {
          setError(result.error);
        } else if (result.teams) {
          setTeams(result.teams);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
        setError("Failed to load teams");
      } finally {
        setIsLoading(false);
      }
    }

    if (isClient) {
      fetchTeams();
    }
  }, [isClient]);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <p>Loading teams...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Teams</h1>
            <p className="text-muted-foreground">
              Manage your teams and view team assessment results
            </p>
          </div>
          <Link href="/teams/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </Link>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : teams.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center space-y-4">
              <Users className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-medium">No teams yet</h3>
                <p className="text-sm text-muted-foreground">Create your first team to start collaborating</p>
              </div>
              <Link href="/teams/create">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Team
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card key={team.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {team.name}
                    {team.role === "admin" && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Admin
                      </span>
                    )}
                    {team.role === "coach" && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        Coach
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {team.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Created: {new Date(team.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href={`/teams/${team.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Team
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
} 