'use client'

import { useTranslations } from 'next-intl'
import { ApiKeysClient } from '@/components/dashboard/ApiKeysClient'
import { PageHeader } from '@/components/ui/PageHeader'

interface ApiKeysPageClientProps {
  publicKey: string
}

export function ApiKeysPageClient({ publicKey }: ApiKeysPageClientProps) {
  const t = useTranslations('api_keys_page')

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
      />
      <ApiKeysClient initialPublicKey={publicKey} />
    </>
  )
}
