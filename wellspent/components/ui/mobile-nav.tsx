"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileNavProps {
  isAuthenticated?: boolean;
  userRole?: string;
}

export function MobileNav({ isAuthenticated = false, userRole }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <nav className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center text-lg font-medium"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          
          {isAuthenticated && (
            <>
              <Link
                href="/assessment"
                className="flex items-center text-lg font-medium"
                onClick={() => setOpen(false)}
              >
                Assessment
              </Link>
              <Link
                href="/results"
                className="flex items-center text-lg font-medium"
                onClick={() => setOpen(false)}
              >
                Results
              </Link>
              <Link
                href="/resources/tips"
                className="flex items-center text-lg font-medium"
                onClick={() => setOpen(false)}
              >
                Resources
              </Link>
              {userRole === 'coach' && (
                <Link
                  href="/teams"
                  className="flex items-center text-lg font-medium"
                  onClick={() => setOpen(false)}
                >
                  Teams
                </Link>
              )}
              {userRole === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center text-lg font-medium"
                  onClick={() => setOpen(false)}
                >
                  Admin
                </Link>
              )}
            </>
          )}
          
          {!isAuthenticated && (
            <>
              <Link
                href="/auth/signin"
                className="flex items-center text-lg font-medium"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center text-lg font-medium"
                onClick={() => setOpen(false)}
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