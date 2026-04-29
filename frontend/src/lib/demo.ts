/**
 * Demo / portfolio mode helpers.
 *
 * When NEXT_PUBLIC_DEMO_MODE=true the app skips Clerk auth so visitors can
 * click through every screen without sign-up. Combine with
 * NEXT_PUBLIC_USE_DUMMY_DATA=true to populate UI surfaces with sample data.
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export function isDemoMode(): boolean {
  return DEMO_MODE
}
