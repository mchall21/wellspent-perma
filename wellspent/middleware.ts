import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Critical: Skip during build/static generation to prevent errors
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.next();
  }
  
  // Don't process middleware on static assets and API routes
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static') || 
    pathname.includes('.') // Files with extensions like .js, .css, etc
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            try {
              return request.cookies.get(name)?.value;
            } catch (e) {
              return undefined;
            }
          },
          set(name: string, value: string, options: any) {
            try {
              response.cookies.set({
                name,
                value,
                ...options,
              });
            } catch (e) {
              console.error('Error setting cookie:', e);
            }
          },
          remove(name: string, options: any) {
            try {
              response.cookies.set({
                name,
                value: '',
                ...options,
              });
            } catch (e) {
              console.error('Error removing cookie:', e);
            }
          },
        },
      }
    );
    
    // Try to refresh the session (with error handling)
    try {
      await supabase.auth.getSession();
    } catch (e) {
      console.error('Error refreshing session:', e);
    }
  } catch (e) {
    console.error('Middleware error:', e);
  }
  
  return response;
}

// Only run middleware on specific routes that need auth
// This helps avoid running it on static assets
export const config = {
  matcher: [
    // Only run on HTML pages, not on static assets
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 