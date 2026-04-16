'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Method = 'client_credentials' | 'static_token' | 'oauth'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: Record<string, string>) => Promise<void>
}

const METHODS: { id: Method; label: string; badge?: string; icon: string; desc: string }[] = [
  {
    id: 'client_credentials',
    label: 'Client Credentials',
    badge: 'Recommended',
    icon: 'vpn_key',
    desc: 'Use your Client ID & Secret from the Shopify dev dashboard.',
  },
  {
    id: 'static_token',
    label: 'Access Token',
    icon: 'token',
    desc: 'Paste a static shpat_… token from a custom app.',
  },
  {
    id: 'oauth',
    label: 'OAuth Install',
    icon: 'open_in_new',
    desc: 'Redirect through the Shopify OAuth flow.',
  },
]

export function ShopifyConnectModal({ open, onOpenChange, onSubmit }: Props) {
  const [method, setMethod] = useState<Method>('client_credentials')
  const [shop, setShop] = useState('')
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const reset = () => {
    setShop('')
    setClientId('')
    setClientSecret('')
    setAccessToken('')
    setError('')
    setLoading(false)
    setMethod('client_credentials')
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) reset()
    onOpenChange(val)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cleanShop = shop.trim().toLowerCase()
    if (!cleanShop || !cleanShop.includes('.myshopify.com')) {
      setError('Enter a valid store domain (e.g. mystore.myshopify.com)')
      return
    }

    if (method === 'client_credentials') {
      if (!clientId.trim() || !clientSecret.trim()) {
        setError('Client ID and Client Secret are required.')
        return
      }
    } else if (method === 'static_token') {
      if (!accessToken.trim()) {
        setError('Access token is required.')
        return
      }
    }

    setLoading(true)
    try {
      if (method === 'client_credentials') {
        await onSubmit({ method, shop: cleanShop, client_id: clientId.trim(), client_secret: clientSecret.trim() })
      } else if (method === 'static_token') {
        await onSubmit({ method, shop: cleanShop, access_token: accessToken.trim() })
      } else {
        await onSubmit({ method, shop: cleanShop })
      }
      handleOpenChange(false)
    } catch (err: any) {
      setError(err?.message || 'Connection failed. Check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ58f__Hs5QwGWIEcsawDwW1o5IQzaYNPONhQ&s"
                  alt="Shopify"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <DialogTitle className="text-base font-black text-slate-900">
                Connect Shopify Store
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              Choose how you want to connect your store.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Method selector */}
          <div className="grid grid-cols-3 gap-2">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => { setMethod(m.id); setError('') }}
                className={`relative flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-all text-xs font-semibold ${
                  method === m.id
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                {m.badge && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none whitespace-nowrap">
                    {m.badge}
                  </span>
                )}
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  {m.icon}
                </span>
                <span className="leading-tight">{m.label}</span>
              </button>
            ))}
          </div>

          {/* Method description */}
          <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
            {METHODS.find((m) => m.id === method)?.desc}
            {method === 'client_credentials' && (
              <span className="block mt-1 text-indigo-600 font-medium">
                Token auto-refreshes every 24h.
              </span>
            )}
          </p>

          {/* Shop domain — always shown */}
          <div className="space-y-1.5">
            <Label htmlFor="shop" className="text-xs font-semibold text-slate-700">
              Store Domain
            </Label>
            <Input
              id="shop"
              placeholder="mystore.myshopify.com"
              value={shop}
              onChange={(e) => setShop(e.target.value)}
              autoComplete="off"
              className="h-9 text-sm"
            />
          </div>

          {/* Client Credentials fields */}
          {method === 'client_credentials' && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="client_id" className="text-xs font-semibold text-slate-700">
                  Client ID
                </Label>
                <Input
                  id="client_id"
                  placeholder="From Apps → Your app → Settings"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  autoComplete="off"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="client_secret" className="text-xs font-semibold text-slate-700">
                  Client Secret
                </Label>
                <Input
                  id="client_secret"
                  type="password"
                  placeholder="shpss_…"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  autoComplete="off"
                  className="h-9 text-sm"
                />
              </div>
            </>
          )}

          {/* Static token field */}
          {method === 'static_token' && (
            <div className="space-y-1.5">
              <Label htmlFor="access_token" className="text-xs font-semibold text-slate-700">
                Access Token
              </Label>
              <Input
                id="access_token"
                type="password"
                placeholder="shpat_…"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                autoComplete="off"
                className="h-9 text-sm"
              />
            </div>
          )}

          {/* OAuth note */}
          {method === 'oauth' && (
            <p className="text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              You&apos;ll be redirected to Shopify to approve the connection. Make sure pop-ups are allowed.
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Footer */}
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-9 text-sm"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-9 text-sm bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting…
                </span>
              ) : method === 'oauth' ? (
                'Continue to Shopify'
              ) : (
                'Connect Store'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
