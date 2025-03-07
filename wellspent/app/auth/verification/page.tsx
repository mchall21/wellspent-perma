import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerificationPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md mx-auto space-y-6 text-center">
        <h1 className="text-3xl font-bold">Check Your Email</h1>
        <p className="text-gray-500">
          We&apos;ve sent you an email with a verification link. Please check your inbox and click the link to verify your account.
        </p>
        <div className="pt-4">
          <Link href="/auth/signin">
            <Button variant="outline" className="w-full">
              Return to Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 