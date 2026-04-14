import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Railway — produces a minimal standalone Node.js server
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/widget',
        headers: [
          // Remove X-Frame-Options to allow embedding in any origin iframe.
          // 'ALLOWALL' is not a valid value; omitting the header entirely is correct.
          // Content-Security-Policy frame-ancestors is the modern replacement.
          { key: 'Content-Security-Policy', value: 'frame-ancestors *' },
        ],
      },
    ]
  },
}

export default withSentryConfig(nextConfig, { silent: true, org: process.env.SENTRY_ORG, project: process.env.SENTRY_PROJECT })
