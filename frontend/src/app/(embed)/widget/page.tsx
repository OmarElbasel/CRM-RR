'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import WidgetShell from '@/components/widget/WidgetShell'

function WidgetContent() {
  const searchParams = useSearchParams()

  const key = searchParams.get('key') || ''
  const lang = (searchParams.get('lang') || 'ar') as 'ar' | 'en' | 'bilingual'
  const theme = (searchParams.get('theme') || 'auto') as 'dark' | 'light' | 'auto'
  const apiUrl = searchParams.get('api_url') || 'https://api.rawaj.io'

  if (!key) {
    return (
      <div className="p-8 text-center" dir="rtl">
        <p className="text-red-600 font-semibold">
          مفتاح API مطلوب / API key is required
        </p>
      </div>
    )
  }

  return (
    <WidgetShell
      apiKey={key}
      apiBaseUrl={apiUrl}
      defaultLanguage={lang}
      theme={theme}
      isIframe={true}
    />
  )
}

export default function WidgetPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <WidgetContent />
    </Suspense>
  )
}
