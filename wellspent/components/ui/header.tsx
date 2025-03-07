"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/auth/user-menu";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  isAuthenticated?: boolean;
  userRole?: string;
  userName?: string;
  userEmail?: string;
}

export function Header({
  isAuthenticated = false,
  userRole,
  userName,
  userEmail,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">WellSpent</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {isAuthenticated && (
              <>
                <Link
                  href="/assessment"
                  className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm"
                >
                  Assessment
                </Link>
                <Link
                  href="/results"
                  className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm"
                >
                  Results
                </Link>
                <Link
                  href="/resources/tips"
                  className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm"
                >
                  Resources
                </Link>
                {userRole === 'coach' && (
                  <Link
                    href="/teams"
                    className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm"
                  >
                    Teams
                  </Link>
                )}
                {userRole === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <UserMenu userName={userName} userEmail={userEmail} />
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
          <MobileNav isAuthenticated={isAuthenticated} userRole={userRole} />
        </div>
      </div>
    </header>
  );
} 