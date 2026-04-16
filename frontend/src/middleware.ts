import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

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
])

export default clerkMiddleware(async (auth, req) => {
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
