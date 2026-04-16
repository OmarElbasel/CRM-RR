'use client'

import React, { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Loader2, Check, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface OrgSettingsProps {
  initialName: string
  onUpdate: (newName: string) => void
}

export function OrgSettings({ initialName, onUpdate }: OrgSettingsProps) {
  const { getToken } = useAuth()
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const token = await getToken()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/update/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.name?.[0] || 'Failed to save. Please try again.')
        return
      }
      const data = await res.json()
      onUpdate(data.name)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* General Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-8">
        <h3 className="font-headline font-black text-xl text-slate-900 mb-6">Organization Profile</h3>
        
        <div className="space-y-6 max-w-xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Organization Name</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                placeholder="Enter organization name"
              />
              <button
                onClick={handleSave}
                disabled={saving || !name.trim() || name === initialName}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
            {error && <p className="text-sm text-rose-500 font-medium">{error}</p>}
          </div>

          <div className="pt-4 border-t border-slate-50">
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              This is the official name of your business account. It will appear on your invoices and automated reports.
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-rose-50/50 rounded-2xl border border-rose-100 p-8 space-y-4">
        <div className="flex items-center gap-3 text-rose-600">
          <span className="material-symbols-outlined">report_problem</span>
          <h3 className="font-headline font-black text-lg">Danger Zone</h3>
        </div>
        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed font-medium">
          Deleting your organization will immediately terminate all access, delete your unified inbox history, and cancel any active subscriptions. This action cannot be undone.
        </p>
        
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-white text-rose-600 border border-rose-200 px-6 py-2.5 rounded-xl font-bold hover:bg-rose-600 hover:text-white transition-all">
              Delete Organization
            </button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl border-none p-8 max-w-md">
            <DialogHeader className="text-left">
              <DialogTitle className="font-headline font-black text-2xl text-slate-900 mb-2">Are you absolutely sure?</DialogTitle>
              <DialogDescription className="text-slate-500 font-medium text-base">
                This will permanently delete the <strong>{initialName}</strong> organization and remove all associated data from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-8 flex gap-3">
              <button className="flex-1 bg-slate-100 text-slate-900 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                Cancel
              </button>
              <button className="flex-1 bg-rose-600 text-white py-3 rounded-2xl font-bold hover:bg-rose-700 transition-all flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Delete Forever
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
