export type PlanId = 'free' | 'starter' | 'pro' | 'enterprise'

export interface Plan {
  id: PlanId
  name: string
  monthlyGenerations: number | null // null = unlimited
  priceUSD: number | null           // null = custom
  features: string[]
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyGenerations: 20,
    priceUSD: 0,
    features: ['20 generations/month', 'Arabic + English', 'Script tag embed'],
  },
  {
    id: 'starter',
    name: 'Starter',
    monthlyGenerations: 200,
    priceUSD: 14,
    features: ['200 generations/month', 'Arabic + English', 'All embed types', 'Priority support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyGenerations: 2000,
    priceUSD: 41,
    features: ['2,000 generations/month', 'Arabic + English', 'All embed types', 'API access', 'Analytics'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyGenerations: null,
    priceUSD: null,
    features: ['Unlimited generations', 'Dedicated support', 'Custom integrations', 'SLA'],
  },
]

export function getPlan(id: PlanId): Plan {
  return PLANS.find(p => p.id === id) ?? PLANS[0]
}

export function getNextPlan(currentId: PlanId): Plan | null {
  const idx = PLANS.findIndex(p => p.id === currentId)
  return idx >= 0 && idx < PLANS.length - 1 ? PLANS[idx + 1] : null
}
