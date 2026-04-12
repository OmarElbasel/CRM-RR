import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Required for Railway — produces a minimal standalone Node.js server
  output: 'standalone',
}

export default nextConfig
