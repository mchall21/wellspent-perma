"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export function AuthNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true when component mounts (client-side only)
    setIsClient(true);
  }, []);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-0 w-full z-50 pointer-events-none">
      <div className="container mx-auto px-4 pb-4 flex justify-end">
        <a href="/assessment" className="pointer-events-auto">
          <Button className="bg-green-600 hover:bg-green-700 shadow-lg">
            Start Assessment
          </Button>
        </a>
      </div>
    </div>
  );
} 