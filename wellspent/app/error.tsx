'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/ui/page-container';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          We're sorry, but we encountered an unexpected error. Our team has been notified.
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
    </PageContainer>
  );
} 