import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Don't run during build/static generation
  // This is critical for Vercel deployment to work correctly
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );
  
  // Refresh session if expired
  await supabase.auth.getSession();
  
  return response;
}

// Update matcher to be more selective about which routes require authentication
export const config = {
  matcher: [
    // Apply authentication middleware to these routes
    '/assessment/:path*',
    '/profile/:path*',
    '/dashboard/:path*',
    '/results/:path*',
    '/teams/:path*',
    '/insights/:path*',
    '/auth/:path*',
    '/debug',
    // Exclude static routes, images, etc.
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 