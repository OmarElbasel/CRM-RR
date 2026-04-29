import { getRequestConfig } from 'next-intl/server'

export const locales = ['en', 'ar']
export const defaultLocale = 'en'

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale ?? defaultLocale
  const messages = (await import(`./${resolvedLocale}.json`)).default
  return { messages, locale: resolvedLocale }
})
