export interface GenerateInputs {
  product_name: string
  category: string
  tone: string
  language: string
  price?: string
  target_audience?: string
}

export interface GenerateResult {
  title: string
  short_description: string
  long_description: string
  keywords: string[]
  seo_meta: string
  session_id: string
  cached: boolean
}

export interface ApiError {
  error: string
  error_ar: string
  code: string
}

export class WidgetApiClient {
  private apiBaseUrl: string
  private apiKey: string

  constructor(apiBaseUrl: string, apiKey: string) {
    this.apiBaseUrl = apiBaseUrl.replace(/\/$/, '')
    this.apiKey = apiKey
  }

  async validateKey(): Promise<{ valid: boolean; org_name: string; plan: string }> {
    const res = await fetch(`${this.apiBaseUrl}/api/auth/validate-public-key/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: this.apiKey }),
      mode: 'cors',
    })

    if (!res.ok) {
      let err: ApiError
      try {
        err = await res.json()
      } catch {
        err = { error: `HTTP ${res.status}`, error_ar: `خطأ HTTP ${res.status}`, code: 'HTTP_ERROR' }
      }
      throw err
    }

    return res.json()
  }

  async generateContent(inputs: GenerateInputs): Promise<GenerateResult> {
    const res = await fetch(`${this.apiBaseUrl}/api/generate/product-content/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify(inputs),
      mode: 'cors',
    })

    if (!res.ok) {
      let err: ApiError
      try {
        err = await res.json()
      } catch {
        err = { error: `HTTP ${res.status}`, error_ar: `خطأ HTTP ${res.status}`, code: 'HTTP_ERROR' }
      }
      throw err
    }

    return res.json()
  }

  createEventSource(sessionId: string): EventSource {
    return new EventSource(
      `${this.apiBaseUrl}/api/generate/stream/?session_id=${sessionId}`
    )
  }
}
