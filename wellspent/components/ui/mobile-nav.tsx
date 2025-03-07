"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface MobileNavProps {
  isAuthenticated?: boolean;
  userRole?: string;
}

export function MobileNav({ isAuthenticated, userRole }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="pr-0">
        <div className="px-7">
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setOpen(false)}
          >
            <span className="font-bold">WellSpent</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-4 px-7 mt-10">
          {isAuthenticated ? (
            <>
              <Link
                href="/assessment"
                onClick={() => setOpen(false)}
                className="text-lg font-medium"
              >
                Assessment
              </Link>
              <Link
                href="/results"
                onClick={() => setOpen(false)}
                className="text-lg font-medium"
              >
                Results
              </Link>
              <Link
                href="/resources/tips"
                onClick={() => setOpen(false)}
                className="text-lg font-medium"
              >
                Resources
              </Link>
              {userRole === 'coach' && (
                <Link
                  href="/teams"
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium"
                >
                  Teams
                </Link>
              )}
              {userRole === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="text-lg font-medium"
              >
                Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="text-lg font-medium"
              >
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                onClick={() => setOpen(false)}
                className="text-lg font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setOpen(false)}
                className="text-lg font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
} 