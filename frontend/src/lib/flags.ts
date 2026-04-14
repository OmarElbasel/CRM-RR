/**
 * Feature flag client helper. Constitution Principle IV.
 * Each flag must be accessed directly so Next.js can statically inline
 * NEXT_PUBLIC_* values into the client bundle (dynamic bracket access breaks this).
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
  | 'SHOPIFY_ORDER_HUB'
  | 'TIKTOK_INBOX'
  | 'CONTENT_ASSISTANT'
  | 'POST_SCHEDULER'

const FLAGS: Record<FeatureFlag, boolean> = {
  AI_GENERATION: process.env.NEXT_PUBLIC_FLAG_AI_GENERATION === 'true',
  BILLING: process.env.NEXT_PUBLIC_FLAG_BILLING === 'true',
  SALLA_INTEGRATION: process.env.NEXT_PUBLIC_FLAG_SALLA_INTEGRATION === 'true',
  ZID_INTEGRATION: process.env.NEXT_PUBLIC_FLAG_ZID_INTEGRATION === 'true',
  PLUGIN_EMBED: process.env.NEXT_PUBLIC_FLAG_PLUGIN_EMBED === 'true',
  UI_REDESIGN: process.env.NEXT_PUBLIC_FLAG_UI_REDESIGN === 'true',
  INBOX: process.env.NEXT_PUBLIC_FLAG_INBOX === 'true',
  PIPELINE: process.env.NEXT_PUBLIC_FLAG_PIPELINE === 'true',
  SHOPIFY_ORDER_HUB: process.env.NEXT_PUBLIC_FLAG_SHOPIFY_ORDER_HUB === 'true',
  TIKTOK_INBOX: process.env.NEXT_PUBLIC_FLAG_TIKTOK_INBOX === 'true',
  CONTENT_ASSISTANT: process.env.NEXT_PUBLIC_FLAG_CONTENT_ASSISTANT === 'true',
  POST_SCHEDULER: process.env.NEXT_PUBLIC_FLAG_POST_SCHEDULER === 'true',
}

export function isEnabled(flag: FeatureFlag): boolean {
  return FLAGS[flag] ?? false
}
