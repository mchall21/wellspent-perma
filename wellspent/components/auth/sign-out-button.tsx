"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

type SignOutButtonProps = {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
};

export function SignOutButton({ variant = "default" }: SignOutButtonProps) {
  const { signOut, isLoading } = useAuth();

  return (
    <Button
      variant={variant}
      onClick={signOut}
      disabled={isLoading}
    >
      {isLoading ? "Signing out..." : "Sign out"}
    </Button>
  );
} 