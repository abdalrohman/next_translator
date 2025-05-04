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
  typescript: {
    // Ignore type errors during build
    ignoreBuildErrors: true,
  },
}

export default nextConfig
