'use client'

import { useTranslations } from 'next-intl'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmbedSnippets } from '@/components/dashboard/EmbedSnippets'
import { PlatformGuide } from '@/components/dashboard/PlatformGuide'
import { Card, CardContent } from '@/components/ui/card'

interface EmbedPageClientProps {
  apiKeyPublic: string
}

export function EmbedPageClient({ apiKeyPublic }: EmbedPageClientProps) {
  const t = useTranslations('embed_page')

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <div className="space-y-6 max-w-2xl">
        <EmbedSnippets apiKeyPublic={apiKeyPublic} />
        <PlatformGuide />

        {/* Live preview */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">{t('live_preview')}</h3>
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
              {t('live_preview_desc')}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
