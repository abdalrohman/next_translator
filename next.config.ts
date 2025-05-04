import type { NextConfig } from 'next'

/**
 * Next.js configuration
 */
const nextConfig: NextConfig = {
  // ESLint configuration
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Exclude example directories from the build
  // This is important for Next.js 15 compatibility
  distDir: 'dist',
  typescript: {
    // Ignore type errors during build
    ignoreBuildErrors: true,
  },
}

export default nextConfig
