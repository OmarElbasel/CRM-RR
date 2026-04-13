'use client'

import { useEffect, useRef, useCallback } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface UseInboxStreamOptions {
  onNewMessage?: (data: Record<string, unknown>) => void
  onMessageUpdated?: (data: Record<string, unknown>) => void
  enabled?: boolean
}

export function useInboxStream({ onNewMessage, onMessageUpdated, enabled = true }: UseInboxStreamOptions) {
  const esRef = useRef<EventSource | null>(null)
  const onNewRef = useRef(onNewMessage)
  const onUpdatedRef = useRef(onMessageUpdated)

  onNewRef.current = onNewMessage
  onUpdatedRef.current = onMessageUpdated

  const close = useCallback(() => {
    if (esRef.current) {
      esRef.current.close()
      esRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      close()
      return
    }

    const es = new EventSource(`${API_URL}/api/inbox/stream/`)
    esRef.current = es

    es.addEventListener('new_message', (e) => {
      try {
        const data = JSON.parse(e.data)
        onNewRef.current?.(data)
      } catch {
        // ignore
      }
    })

    es.addEventListener('message_updated', (e) => {
      try {
        const data = JSON.parse(e.data)
        onUpdatedRef.current?.(data)
      } catch {
        // ignore
      }
    })

    es.onerror = () => {
      // EventSource auto-reconnects by default
    }

    return () => {
      es.close()
      esRef.current = null
    }
  }, [enabled, close])

  return { close }
}
