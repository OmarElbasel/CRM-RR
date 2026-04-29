'use client'

import { NextIntlClientProvider } from 'next-intl'
import { useLocaleContext } from './LocaleProvider'
import en from '@/lib/i18n/en.json'
import ar from '@/lib/i18n/ar.json'
import { type ReactNode } from 'react'

const messagesMap = { en, ar }

export function I18nProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocaleContext()

  return (
    <NextIntlClientProvider locale={locale} messages={messagesMap[locale]}>
      {children}
    </NextIntlClientProvider>
  )
}
