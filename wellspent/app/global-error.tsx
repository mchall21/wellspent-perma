'use client';

import { Inter } from "next/font/google";
import { Button } from '@/components/ui/button';

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            We're sorry, but we encountered a critical error. Our team has been notified.
          </p>
          <div className="space-x-4">
            <Button onClick={() => window.location.href = '/'}>
              Go to Home
            </Button>
            <Button variant="outline" onClick={() => reset()}>
              Try again
            </Button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-md text-left w-full max-w-2xl">
              <h2 className="text-lg font-semibold text-red-800 mb-2">Error Details (Development Only)</h2>
              <p className="font-mono text-sm break-all whitespace-pre-wrap text-red-700">
                {error.message}
                {error.stack && (
                  <>
                    <br /><br />
                    {error.stack}
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </body>
    </html>
  );
} 