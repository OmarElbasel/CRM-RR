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
import { ArrowRight, LogIn, Ticket, CheckCircle2 } from 'lucide-react'

type Method = 'oauth' | 'manual'
type Platform = 'instagram' | 'facebook'

interface Props {
  open: boolean
  platform: Platform
  onOpenChange: (open: boolean) => void
  onOAuth: () => void
  onManual: (payload: { page_id: string; page_access_token: string }) => Promise<void>
}

const PLATFORM_CONFIG = {
  instagram: {
    name: 'Instagram',
    logo: '/brands/instagram.svg',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    accountLabel: 'Instagram Business Account ID',
    accountPlaceholder: '17841400455511111',
    accountHelp: 'Found in Meta Business Suite → Instagram Account → About',
    features: ['Direct Messages (DMs)', 'Post Comments & Replies', 'Story Mentions'],
  },
  facebook: {
    name: 'Facebook Page',
    logo: '/brands/facebook.svg',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    accountLabel: 'Facebook Page ID',
    accountPlaceholder: '123456789012345',
    accountHelp: 'Found in your Page → About → Page transparency',
    features: ['Messenger Messages', 'Post Comments & Replies', 'Page Interactions'],
  },
}

const METHODS: { id: Method; label: string; badge?: string; icon: React.ReactNode; desc: string }[] = [
  {
    id: 'oauth',
    label: 'Facebook Login',
    badge: 'Recommended',
    icon: <LogIn className="text-lg" />,
    desc: 'Log in with Facebook and approve permissions. Easiest setup — no credentials needed.',
  },
  {
    id: 'manual',
    label: 'Page Token',
    icon: <Ticket className="text-lg" />,
    desc: 'Paste a Page Access Token from Meta for Developers. For technical users.',
  },
]

export function MetaConnectModal({ open, platform, onOpenChange, onOAuth, onManual }: Props) {
  const config = PLATFORM_CONFIG[platform]
  const [method, setMethod] = useState<Method>('oauth')
  const [pageId, setPageId] = useState('')
  const [pageToken, setPageToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const reset = () => {
    setMethod('oauth')
    setPageId('')
    setPageToken('')
    setError('')
    setLoading(false)
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) reset()
    onOpenChange(val)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (method === 'oauth') {
      onOAuth()
      handleOpenChange(false)
      return
    }

    if (!pageId.trim()) {
      setError(`${config.accountLabel} is required.`)
      return
    }
    if (!pageToken.trim()) {
      setError('Page Access Token is required.')
      return
    }

    setLoading(true)
    try {
      await onManual({ page_id: pageId.trim(), page_access_token: pageToken.trim() })
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
              <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center`}>
                <img src={config.logo} alt={config.name} className="w-6 h-6 object-contain" />
              </div>
              <DialogTitle className="text-base font-black text-slate-900">
                Connect {config.name}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              Read and reply to messages & comments directly from your CRM.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Method selector */}
          <div className="grid grid-cols-2 gap-2">
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
                {m.icon}
                <span className="leading-tight">{m.label}</span>
              </button>
            ))}
          </div>

          {/* Method description */}
          <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
            {METHODS.find((m) => m.id === method)?.desc}
          </p>

          {/* OAuth — show what permissions will be granted */}
          {method === 'oauth' && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-700">What you'll be able to do:</p>
              <ul className="space-y-1.5">
                {config.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="text-emerald-500 text-sm" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Manual token fields */}
          {method === 'manual' && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="page_id" className="text-xs font-semibold text-slate-700">
                  {config.accountLabel}
                </Label>
                <Input
                  id="page_id"
                  placeholder={config.accountPlaceholder}
                  value={pageId}
                  onChange={(e) => setPageId(e.target.value)}
                  autoComplete="off"
                  className="h-9 text-sm"
                />
                <p className="text-[11px] text-slate-400">{config.accountHelp}</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="page_token" className="text-xs font-semibold text-slate-700">
                  Page Access Token
                </Label>
                <Input
                  id="page_token"
                  type="password"
                  placeholder="EAABsbCS…"
                  value={pageToken}
                  onChange={(e) => setPageToken(e.target.value)}
                  autoComplete="off"
                  className="h-9 text-sm"
                />
                <p className="text-[11px] text-slate-400">
                  Generate from Meta for Developers → Graph API Explorer → select your Page.
                </p>
              </div>
            </>
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
              variant="ds-line"
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
                <span className="flex items-center gap-1.5">
                  Continue to Facebook
                  <ArrowRight className="text-sm" />
                </span>
              ) : (
                'Connect Account'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
