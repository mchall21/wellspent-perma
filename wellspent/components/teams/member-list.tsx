"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateTeamMemberRole, removeTeamMember } from "@/lib/actions/team";
import { toast } from "sonner";
import { MoreHorizontal, UserMinus, UserCog } from "lucide-react";
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

interface MemberListProps {
  teamId: string;
  members: {
    id: string;
    userId: string;
    role: string;
    joinedAt: string;
    user: {
      id: string;
      email: string;
      name: string | null;
    };
  }[];
  currentUserRole: string;
  currentUserId: string;
}

export function MemberList({
  teamId,
  members,
  currentUserRole,
  currentUserId,
}: MemberListProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  const isAdmin = currentUserRole === "admin";

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!isAdmin) return;

    setIsLoading(true);
    try {
      const result = await updateTeamMemberRole(teamId, userId, newRole);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Member role updated to ${newRole}`);
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update member role");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    setIsLoading(true);
    try {
      const result = await removeTeamMember(teamId, userId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Member removed from team");
        router.refresh();
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    } finally {
      setIsLoading(false);
      setMemberToRemove(null);
    }
  };

  const confirmRemoveMember = (userId: string) => {
    setMemberToRemove(userId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            {isAdmin && <TableHead className="w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                {member.user.name || "No name"}
              </TableCell>
              <TableCell>{member.user.email}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.role === "admin"
                      ? "bg-blue-100 text-blue-800"
                      : member.role === "coach"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {member.role}
                </span>
              </TableCell>
              <TableCell>{formatDate(member.joinedAt)}</TableCell>
              {isAdmin && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        disabled={isLoading}
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {member.userId !== currentUserId && (
                        <>
                          <DropdownMenuItem
                            onClick={() =>
                              handleRoleChange(
                                member.userId,
                                member.role === "admin" ? "member" : "admin"
                              )
                            }
                          >
                            <UserCog className="mr-2 h-4 w-4" />
                            {member.role === "admin"
                              ? "Make Member"
                              : "Make Admin"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleRoleChange(
                                member.userId,
                                member.role === "coach" ? "member" : "coach"
                              )
                            }
                          >
                            <UserCog className="mr-2 h-4 w-4" />
                            {member.role === "coach"
                              ? "Make Member"
                              : "Make Coach"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => confirmRemoveMember(member.userId)}
                            className="text-red-600"
                          >
                            <UserMinus className="mr-2 h-4 w-4" />
                            Remove from Team
                          </DropdownMenuItem>
                        </>
                      )}
                      {member.userId === currentUserId && (
                        <DropdownMenuItem
                          onClick={() => confirmRemoveMember(member.userId)}
                          className="text-red-600"
                        >
                          <UserMinus className="mr-2 h-4 w-4" />
                          Leave Team
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(open: boolean) => !open && setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {memberToRemove === currentUserId
                ? "Leave Team"
                : "Remove Team Member"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {memberToRemove === currentUserId
                ? "Are you sure you want to leave this team? You will lose access to team data."
                : "Are you sure you want to remove this member from the team? They will lose access to team data."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => memberToRemove && handleRemoveMember(memberToRemove)}
              className="bg-red-600 hover:bg-red-700"
            >
              {memberToRemove === currentUserId ? "Leave" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 