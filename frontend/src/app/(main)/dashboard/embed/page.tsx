import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { EmbedPageClient } from './EmbedPageClient'

async function fetchOrgUsage(token: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/usage/`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function EmbedPage() {
  const { getToken } = auth()
  const token = await getToken()
  if (!token) redirect('/')

  const data = await fetchOrgUsage(token)
  const apiKeyPublic = data?.api_key_public || 'pk_live_your_key_here'

  return <EmbedPageClient apiKeyPublic={apiKeyPublic} />
}
