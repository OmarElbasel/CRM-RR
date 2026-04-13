'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { WidgetApiClient } from '@/lib/api'
import type { GenerateInputs } from '@/lib/api'
import { useStreamGeneration } from '@/hooks/useStreamGeneration'
import { sendReady, sendResult, sendError, onPrefill } from '@/lib/embed/postmessage'
import ProductForm from './ProductForm'
import GenerateButton from './GenerateButton'
import ErrorDisplay from './ErrorDisplay'
import ResultCard from './ResultCard'
import './widget.css'

interface WidgetShellProps {
  apiKey: string
  apiBaseUrl: string
  defaultLanguage?: 'ar' | 'en' | 'bilingual'
  theme?: 'dark' | 'light' | 'auto'
  isIframe?: boolean
}

export default function WidgetShell({
  apiKey,
  apiBaseUrl,
  defaultLanguage = 'ar',
  theme = 'auto',
  isIframe = false,
}: WidgetShellProps) {
  const [language, setLanguage] = useState<'ar' | 'en' | 'bilingual'>(defaultLanguage)
  const [orgInfo, setOrgInfo] = useState<{ org_name: string; plan: string } | null>(null)
  const [keyValid, setKeyValid] = useState(false)
  const [keyError, setKeyError] = useState<{
    message: string
    message_ar: string
    code: string
  } | null>(null)
  const [prefillData, setPrefillData] = useState<Partial<GenerateInputs> | undefined>(undefined)

  const lastInputsRef = useRef<GenerateInputs | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const apiClient = useMemo(
    () => new WidgetApiClient(apiBaseUrl, apiKey),
    [apiBaseUrl, apiKey]
  )

  const stream = useStreamGeneration(apiClient)

  // Validate API key on mount
  useEffect(() => {
    let cancelled = false
    apiClient
      .validateKey()
      .then((res) => {
        if (cancelled) return
        setKeyValid(true)
        setOrgInfo(res)
      })
      .catch((err) => {
        if (cancelled) return
        if (err && typeof err === 'object' && 'error' in err) {
          setKeyError({
            message: err.error ?? 'Invalid API key',
            message_ar: err.error_ar ?? 'مفتاح API غير صالح',
            code: err.code ?? 'INVALID_API_KEY',
          })
        } else {
          setKeyError({
            message: 'Failed to validate API key',
            message_ar: 'فشل التحقق من مفتاح API',
            code: 'VALIDATION_FAILED',
          })
        }
      })
    return () => {
      cancelled = true
    }
  }, [apiClient])

  // postMessage integration (only when isIframe)
  useEffect(() => {
    if (!isIframe) return
    if (keyValid) sendReady()
  }, [isIframe, keyValid])

  useEffect(() => {
    if (!isIframe) return
    return onPrefill((data) => setPrefillData(data))
  }, [isIframe])

  useEffect(() => {
    if (!isIframe) return
    if (stream.state === 'done' && stream.result) {
      sendResult({
        title: stream.result.title,
        short_description: stream.result.short_description,
        long_description: stream.result.long_description,
        keywords: stream.result.keywords,
        seo_meta: stream.result.seo_meta,
      })
    }
    if (stream.state === 'error' && stream.error) {
      sendError({
        code: stream.error.code,
        message: stream.error.message,
        message_ar: stream.error.message_ar,
      })
    }
  }, [isIframe, stream.state, stream.result, stream.error])

  const handleSubmit = useCallback(
    (inputs: GenerateInputs) => {
      lastInputsRef.current = inputs
      stream.generate(inputs)
    },
    [stream]
  )

  const handleRegenerate = useCallback(() => {
    if (lastInputsRef.current) {
      stream.reset()
      stream.generate(lastInputsRef.current)
    }
  }, [stream])

  const isArabic = language !== 'en'

  // Loading skeleton while validating key
  if (!keyValid && !keyError) {
    return (
      <div
        className="rawaj-widget max-w-2xl mx-auto p-4 font-sans"
        data-theme={theme}
        dir={isArabic ? 'rtl' : 'ltr'}
        style={{ backgroundColor: 'var(--rawaj-bg)' }}
      >
        <div className="space-y-4">
          <div className="rawaj-skeleton h-10 w-1/2" />
          <div className="rawaj-skeleton h-12 w-full" />
          <div className="rawaj-skeleton h-12 w-full" />
          <div className="rawaj-skeleton h-12 w-3/4" />
        </div>
      </div>
    )
  }

  // Key validation error
  if (keyError) {
    return (
      <div
        className="rawaj-widget max-w-2xl mx-auto p-4 font-sans"
        data-theme={theme}
        dir={isArabic ? 'rtl' : 'ltr'}
        style={{ backgroundColor: 'var(--rawaj-bg)' }}
      >
        <ErrorDisplay error={keyError} language={language} />
      </div>
    )
  }

  // Widget ready
  return (
    <div
      className="rawaj-widget w-full max-w-2xl mx-auto p-4 font-sans"
      data-theme={theme}
      dir={isArabic ? 'rtl' : 'ltr'}
      style={{ backgroundColor: 'var(--rawaj-bg)', color: 'var(--rawaj-text)' }}
    >
      <ProductForm
        onSubmit={handleSubmit}
        disabled={stream.state === 'submitting' || stream.state === 'streaming'}
        language={language}
        onLanguageChange={setLanguage}
        defaultValues={prefillData}
        formRef={formRef}
      />

      <GenerateButton
        onClick={() => {
          if (formRef.current) formRef.current.requestSubmit()
        }}
        loading={stream.state === 'submitting' || stream.state === 'streaming'}
        disabled={false}
        language={language}
      />

      <ErrorDisplay error={stream.error} language={language} onRetry={stream.retry} />

      <ResultCard
        result={stream.result}
        streamingTokens={stream.tokens}
        state={stream.state}
        language={language}
      />

      {stream.state === 'done' && stream.result && (
        <button
          type="button"
          onClick={handleRegenerate}
          className="mt-4 min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full"
          style={{
            backgroundColor: 'var(--rawaj-border)',
            color: 'var(--rawaj-text)',
          }}
        >
          {isArabic ? 'إعادة التوليد' : 'Regenerate'}
        </button>
      )}
    </div>
  )
}
