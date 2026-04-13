import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmbedSnippets } from '@/components/dashboard/EmbedSnippets'
import { PlatformGuide } from '@/components/dashboard/PlatformGuide'
import { Card, CardContent } from '@/components/ui/card'

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

  return (
    <>
      <PageHeader
        title="Embed Widget"
        subtitle="Add the AI product description widget to your store"
      />

      <div className="space-y-6 max-w-2xl">
        <EmbedSnippets apiKeyPublic={apiKeyPublic} />
        <PlatformGuide />

        {/* Live preview */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Live Preview</h3>
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <iframe
                src={`https://widget.rawaj.app/embed?key=${apiKeyPublic}`}
                width="100%"
                height="400"
                className="border-0"
                title="Widget preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              This is a live preview of how the widget will appear on your store.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
