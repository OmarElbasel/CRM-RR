'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { GenerateInputs, GenerateResult, WidgetApiClient } from '@/lib/api'

export type StreamState = 'idle' | 'submitting' | 'streaming' | 'done' | 'error'

export interface StreamError {
  message: string
  message_ar: string
  code: string
}

export function useStreamGeneration(apiClient: WidgetApiClient | null) {
  const [state, setState] = useState<StreamState>('idle')
  const [tokens, setTokens] = useState('')
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [error, setError] = useState<StreamError | null>(null)

  const eventSourceRef = useRef<EventSource | null>(null)
  const lastInputsRef = useRef<GenerateInputs | null>(null)

  const closeEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
  }, [])

  const generate = useCallback(
    async (inputs: GenerateInputs) => {
      if (!apiClient) return

      lastInputsRef.current = inputs
      setState('submitting')
      setTokens('')
      setResult(null)
      setError(null)
      closeEventSource()

      try {
        const genResult = await apiClient.generateContent(inputs)
        setResult(genResult)

        setState('streaming')
        const es = apiClient.createEventSource(genResult.session_id)
        eventSourceRef.current = es

        es.onmessage = (event) => {
          if (event.data === '[DONE]') {
            setState('done')
            es.close()
            eventSourceRef.current = null
            return
          }
          setTokens((prev) => prev + event.data)
        }

        es.onerror = () => {
          setState('error')
          setError({
            message: 'Stream connection lost. Partial content may be available.',
            message_ar: 'انقطع الاتصال بالبث. قد يكون المحتوى الجزئي متاحًا.',
            code: 'STREAM_ERROR',
          })
          es.close()
          eventSourceRef.current = null
        }
      } catch (err: unknown) {
        setState('error')
        if (
          err &&
          typeof err === 'object' &&
          'error' in err &&
          'error_ar' in err &&
          'code' in err
        ) {
          const apiErr = err as { error: string; error_ar: string; code: string }
          setError({
            message: apiErr.error,
            message_ar: apiErr.error_ar,
            code: apiErr.code,
          })
        } else {
          setError({
            message: 'An unexpected error occurred.',
            message_ar: 'حدث خطأ غير متوقع.',
            code: 'UNKNOWN_ERROR',
          })
        }
      }
    },
    [apiClient, closeEventSource]
  )

  const retry = useCallback(() => {
    if (lastInputsRef.current) {
      generate(lastInputsRef.current)
    }
  }, [generate])

  const reset = useCallback(() => {
    closeEventSource()
    setState('idle')
    setTokens('')
    setResult(null)
    setError(null)
  }, [closeEventSource])

  useEffect(() => {
    return () => {
      closeEventSource()
    }
  }, [closeEventSource])

  return { state, tokens, result, error, generate, retry, reset }
}
