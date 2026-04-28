import { getRequestConfig } from 'next-intl/server'

export const locales = ['en', 'ar']
export const defaultLocale = 'en'

export default getRequestConfig(async ({ locale }) => {
  const messages = (await import(`./${locale}.json`)).default
  return { messages, locale }
})
