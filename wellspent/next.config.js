/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This prevents static optimization for routes that use cookies
    // which will fix the deployment error
    serverComponentsExternalPackages: ['@supabase/auth-helpers-nextjs']
  },
  // Configure specific routes that require dynamic rendering
  output: 'standalone',
  trailingSlash: false,
  // Declare which routes need dynamic rendering
  // All authenticated routes should be dynamic
  dynamicParams: true
};

module.exports = nextConfig;
