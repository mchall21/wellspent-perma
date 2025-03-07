"use client";

import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignUpPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      <AuthForm type="signup" />
      <p className="mt-4 text-sm text-center text-gray-500">
        Already have an account?{" "}
        <Link href="/auth/signin" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
} 