import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

/**
 * Public routes that do NOT require authentication.
 * All other routes are protected by Clerk.
 */
const isPublicRoute = createRouteMatcher([
  '/health',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/widget(.*)',
  '/org-setup(.*)',
  '/privacy',
  '/terms',
  '/cookies',
  '/security',
  '/status',
  '/docs(.*)',
  '/access-denied',
])

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export default DEMO_MODE
  ? () => NextResponse.next()
  : clerkMiddleware(async (auth, req) => {
      if (!isPublicRoute(req)) {
        auth().protect()
      }
    })

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
