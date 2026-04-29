'use client'

import { useTranslations } from 'next-intl'
import { GeneratorForm } from '@/components/dashboard/GeneratorForm'

export default function GeneratorPage() {
  const t = useTranslations('generator')
  return (
    <div className="pt-24 px-8 pb-12 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-ds-text tracking-tight mb-2">{t('title')}</h1>
          <p className="text-ds-text-2 font-body">{t('subtitle')}</p>
        </div>
        <GeneratorForm />
      </div>
    </div>
  )
}
