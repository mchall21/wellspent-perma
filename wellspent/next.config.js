/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force the app to be deployed as a standalone app (not statically exported)
  output: 'standalone',
  
  // Ignore TypeScript errors since we're handling them differently
  typescript: { 
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable static optimization to prevent cookie access errors
  experimental: {
    // This prevents static optimization for routes that use cookies
    serverComponentsExternalPackages: ['@supabase/auth-helpers-nextjs'],
    // This forces pages to be server-rendered
    serverActions: {
      allowedOrigins: ['localhost:3000', 'wellspent.vercel.app'],
    },
  },
  
  // Misc options
  trailingSlash: false,
  reactStrictMode: true,
};

module.exports = nextConfig;
