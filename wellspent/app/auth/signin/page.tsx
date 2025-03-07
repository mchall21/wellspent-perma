"use client";

import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignInPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      <AuthForm type="signin" />
      <p className="mt-4 text-sm text-center text-gray-500">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
} 