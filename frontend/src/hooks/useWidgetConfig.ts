import { useMemo } from 'react'

export interface WidgetConfig {
  apiKey: string
  container: string
  language: 'ar' | 'en' | 'bilingual'
  theme: 'dark' | 'light' | 'auto'
  apiBaseUrl: string
}

const DEFAULTS: Omit<WidgetConfig, 'apiKey'> = {
  container: '#rawaj-plugin',
  language: 'ar',
  theme: 'auto',
  apiBaseUrl: 'https://api.rawaj.io',
}

export function useWidgetConfig(overrides?: Partial<WidgetConfig>): WidgetConfig {
  return useMemo(
    () => ({
      apiKey: overrides?.apiKey ?? '',
      container: overrides?.container ?? DEFAULTS.container,
      language: overrides?.language ?? DEFAULTS.language,
      theme: overrides?.theme ?? DEFAULTS.theme,
      apiBaseUrl: overrides?.apiBaseUrl ?? DEFAULTS.apiBaseUrl,
    }),
    [
      overrides?.apiKey,
      overrides?.container,
      overrides?.language,
      overrides?.theme,
      overrides?.apiBaseUrl,
    ]
  )
}
