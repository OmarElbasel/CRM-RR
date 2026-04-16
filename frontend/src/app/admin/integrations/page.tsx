'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { adminApi } from '@/lib/admin-api'

// ── Types ──────────────────────────────────────────────────────────────────

interface CredentialStatus {
  provider: string
  app_id: string
  app_secret_set: boolean
  extra_fields: Record<string, boolean>
  updated_at: string | null
}

interface ProviderConfig {
  label: string
  description: string
  fields: { key: string; label: string; placeholder: string; secret?: boolean }[]
  extraFields: { key: string; label: string; placeholder: string }[]
}

const PROVIDERS: Record<string, ProviderConfig> = {
  META: {
    label: 'Meta',
    description: 'Powers Facebook, Instagram, and WhatsApp connections for all your merchants.',
    fields: [
      { key: 'app_id', label: 'App ID', placeholder: '1234567890' },
      { key: 'app_secret', label: 'App Secret', placeholder: 'Enter new secret to update', secret: true },
    ],
    extraFields: [
      { key: 'verify_token', label: 'Webhook Verify Token', placeholder: 'my_random_verify_token' },
    ],
  },
  SHOPIFY: {
    label: 'Shopify',
    description: 'Used to install your Shopify app on merchant stores via OAuth.',
    fields: [
      { key: 'app_id', label: 'Client ID', placeholder: 'shp_xxxxxxxxxxxxx' },
      { key: 'app_secret', label: 'Client Secret', placeholder: 'Enter new secret to update', secret: true },
    ],
    extraFields: [
      { key: 'webhook_secret', label: 'Webhook Secret', placeholder: 'Enter new secret to update' },
      { key: 'api_version', label: 'API Version', placeholder: '2024-01' },
    ],
  },
  TIKTOK: {
    label: 'TikTok',
    description: 'Enables TikTok account connections for merchants via TikTok for Business.',
    fields: [
      { key: 'app_id', label: 'Client Key', placeholder: 'awxxxxxxxxxxxxxxxx' },
      { key: 'app_secret', label: 'Client Secret', placeholder: 'Enter new secret to update', secret: true },
    ],
    extraFields: [],
  },
}

// ── Credential Card ────────────────────────────────────────────────────────

function CredentialCard({
  provider,
  config,
  status,
  getToken,
  onSaved,
}: {
  provider: string
  config: ProviderConfig
  status: CredentialStatus | null
  getToken: () => Promise<string | null>
  onSaved: () => void
}) {
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)

  const allFields = [...config.fields, ...config.extraFields]

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      // Fetch a fresh token at call time — never use a cached/stale one
      const t = await getToken()
      if (!t) throw new Error('Not authenticated')

      // Only include non-empty fields — empty secret field means "don't change"
      const payload: Record<string, string> = {}
      for (const f of allFields) {
        const val = form[f.key] ?? ''
        if (val) payload[f.key] = val
      }
      // Always include app_id even if empty (to allow clearing it)
      if ('app_id' in form || status?.app_id) {
        payload['app_id'] = form['app_id'] ?? status?.app_id ?? ''
      }
      await adminApi.savePlatformCredential(t, provider, payload)
      setMessage({ text: 'Saved successfully.', ok: true })
      setForm({})
      onSaved()
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to save.', ok: false })
    } finally {
      setSaving(false)
    }
  }

  const handleClear = async () => {
    if (!confirm(`Remove ${config.label} credentials? The system will fall back to .env values.`)) return
    setClearing(true)
    try {
      const t = await getToken()
      if (!t) throw new Error('Not authenticated')
      await adminApi.clearPlatformCredential(t, provider)
      setMessage({ text: 'Credentials cleared. Falling back to .env.', ok: true })
      onSaved()
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to clear.', ok: false })
    } finally {
      setClearing(false)
    }
  }

  const isConfigured = status ? (status.app_id || status.app_secret_set) : false

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{config.label}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{config.description}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
          isConfigured
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-slate-100 text-slate-500 border border-slate-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          {isConfigured ? 'Configured' : 'Not configured'}
        </span>
      </div>

      {/* Form */}
      <div className="px-6 py-5 space-y-4">
        {config.fields.map(field => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {field.label}
              {field.key === 'app_id' && status?.app_id && (
                <span className="ml-2 font-mono text-xs text-slate-400">current: {status.app_id}</span>
              )}
              {field.secret && status?.app_secret_set && (
                <span className="ml-2 text-xs text-slate-400">● currently set</span>
              )}
            </label>
            <input
              type={field.secret ? 'password' : 'text'}
              value={form[field.key] ?? ''}
              onChange={e => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        ))}

        {config.extraFields.length > 0 && (
          <div className="pt-2 border-t border-slate-100 space-y-4">
            {config.extraFields.map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {field.label}
                  {status?.extra_fields?.[`${field.key}_set`] && (
                    <span className="ml-2 text-xs text-slate-400">● currently set</span>
                  )}
                </label>
                <input
                  type="password"
                  value={form[field.key] ?? ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        )}

        {message && (
          <p className={`text-sm font-medium ${message.ok ? 'text-emerald-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : `Save ${config.label} Credentials`}
          </button>
          {isConfigured && (
            <button
              onClick={handleClear}
              disabled={clearing}
              className="px-4 py-2 text-red-600 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              {clearing ? 'Clearing…' : 'Clear'}
            </button>
          )}
          {status?.updated_at && (
            <span className="text-xs text-slate-400 ml-auto">
              Last updated {new Date(status.updated_at).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const { getToken } = useAuth()
  const [credentials, setCredentials] = useState<CredentialStatus[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      // Always fetch a fresh token — never cache it in state
      const t = await getToken()
      if (!t) return
      const data = await adminApi.getPlatformCredentials(t)
      setCredentials(data)
    } catch (err) {
      console.error('Failed to load platform credentials', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const getStatus = (provider: string) =>
    credentials.find(c => c.provider === provider) ?? null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Integrations</h1>
        <p className="text-slate-500 mt-1 text-sm">
          These are <strong>platform-level</strong> OAuth app credentials — set once here and all
          merchants on Rawaj will use them to connect their own accounts. Merchants never see these
          credentials; they only go through the OAuth flow you set up.
        </p>
      </div>

      <div className="rounded-xl bg-indigo-50 border border-indigo-200 px-5 py-4 text-sm text-indigo-800">
        <strong>How it works:</strong> You create a Meta App (or Shopify Partner App) once, enter
        the credentials below, and every merchant using Rawaj connects <em>their</em> account
        through your app's OAuth flow. Their tokens are stored securely per-org in the database.
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(PROVIDERS).map(([provider, config]) => (
            <CredentialCard
              key={provider}
              provider={provider}
              config={config}
              status={getStatus(provider)}
              getToken={getToken}
              onSaved={load}
            />
          ))}
        </div>
      )}
    </div>
  )
}
