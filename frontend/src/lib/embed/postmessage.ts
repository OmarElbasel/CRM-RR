export interface RawajMessage {
  type: string
  payload?: unknown
}

export interface PrefillPayload {
  product_name?: string
  category?: string
  tone?: string
  language?: string
  price?: string
  target_audience?: string
}

export interface ResultPayload {
  title: string
  short_description: string
  long_description: string
  keywords: string[]
  seo_meta: string
}

export interface ErrorPayload {
  code: string
  message: string
  message_ar: string
}

export function sendMessage(type: string, payload: unknown): void {
  window.parent.postMessage({ type, payload }, '*')
}

export function sendReady(): void {
  sendMessage('RAWAJ_READY', { version: '1.0.0' })
}

export function sendResult(result: ResultPayload): void {
  sendMessage('RAWAJ_RESULT', result)
}

export function sendError(error: ErrorPayload): void {
  sendMessage('RAWAJ_ERROR', error)
}

export function onPrefill(
  callback: (data: PrefillPayload) => void,
  allowedOrigin?: string
): () => void {
  const handler = (event: MessageEvent) => {
    if (event.data?.type !== 'RAWAJ_PREFILL') return
    if (allowedOrigin && event.origin !== allowedOrigin) return
    callback(event.data.payload)
  }

  window.addEventListener('message', handler)
  return () => window.removeEventListener('message', handler)
}
