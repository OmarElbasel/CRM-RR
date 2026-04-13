import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ApiKeysClient } from '@/components/dashboard/ApiKeysClient'
import { PageHeader } from '@/components/ui/PageHeader'

export default async function ApiKeysPage() {
  const { getToken } = auth()
  const token = await getToken()
  if (!token) redirect('/')

  let publicKey = ''
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/usage/`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (res.ok) {
      const data = await res.json()
      publicKey = data.api_key_public || ''
    }
  } catch {}

  return (
    <>
      <PageHeader
        title="API Keys"
        subtitle="Manage your API keys for widget embeds"
      />
      <ApiKeysClient initialPublicKey={publicKey} />
    </>
  )
}
