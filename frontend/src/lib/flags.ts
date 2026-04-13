/**
 * Feature flag client helper. Constitution Principle IV.
 * Reads from NEXT_PUBLIC_FLAG_* environment variables.
 * Unknown flags default to false (fail-safe).
 */

type FeatureFlag =
  | 'AI_GENERATION'
  | 'BILLING'
  | 'SALLA_INTEGRATION'
  | 'ZID_INTEGRATION'
  | 'PLUGIN_EMBED'
  | 'UI_REDESIGN'
  | 'INBOX'
  | 'PIPELINE'

/**
 * Returns true if the named feature flag is enabled.
 * Works in both Server Components (process.env) and Client Components (NEXT_PUBLIC_*).
 */
export function isEnabled(flag: FeatureFlag): boolean {
  const envKey = `NEXT_PUBLIC_FLAG_${flag}` as keyof NodeJS.ProcessEnv
  return process.env[envKey] === 'true'
}
