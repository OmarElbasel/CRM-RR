export type OnboardingState = {
  created_workspace: boolean
  connected_channel: boolean
  first_generation: boolean
  invited_teammate: boolean
}

export async function getOnboarding(token: string): Promise<OnboardingState> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/onboarding/`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch onboarding state')
  return res.json()
}

export async function completeOnboarding(token: string, step: keyof OnboardingState): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/onboarding/complete/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ step }),
  })
  if (!res.ok) throw new Error('Failed to complete onboarding step')
}
