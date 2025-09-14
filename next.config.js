/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure API routes work properly in production
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
  },
  // Handle experimental features for Next.js 15
  experimental: {
    // Enable optimizations for production
    serverComponentsExternalPackages: ['apollo-server-micro', 'graphql'],
  },
  // Ensure proper API route handling
  async rewrites() {
    return [
      // No rewrites needed for now, but structure is ready
    ];
  },
}

module.exports = nextConfig