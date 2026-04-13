'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Check, AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface OrgData {
  name: string
  plan: string
  reset_date: string
}

export default function SettingsPage() {
  const { getToken } = useAuth()
  const [org, setOrg] = useState<OrgData | null>(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrg() {
      try {
        const token = await getToken()
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/usage/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          // Also fetch org name from /api/org/
          const orgRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (orgRes.ok) {
            const orgData = await orgRes.json()
            setOrg({
              name: orgData.name,
              plan: data.plan,
              reset_date: data.reset_date,
            })
            setName(orgData.name)
          }
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchOrg()
  }, [getToken])

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
      setOrg((prev) => prev ? { ...prev, name: data.name } : prev)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Settings" />
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Settings" />

      <div className="max-w-2xl space-y-6">
        {/* Organization Info */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Organization</h3>

            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="org-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="max-w-sm"
                />
                <Button
                  onClick={handleSave}
                  disabled={saving || !name.trim() || name === org?.name}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : saved ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Saved
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Plan Info */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Plan</h3>
            <div className="flex items-center gap-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 uppercase tracking-wide">
                  {org?.plan || 'Free'} Plan
                </span>
              </div>
              {org?.reset_date && (
                <span className="text-sm text-gray-500">
                  Next reset: {org.reset_date}
                </span>
              )}
            </div>
            <Link
              href="/dashboard/upgrade"
              className="inline-block text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Upgrade plan →
            </Link>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="rounded-xl shadow-sm border-red-200">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-sm font-semibold text-red-700">Danger Zone</h3>
            <p className="text-sm text-gray-500">
              Deleting your account is permanent and cannot be undone. All data will be lost.
            </p>
            <Dialog>
              <DialogTrigger render={<Button variant="destructive" className="rounded-lg" />}>
                  Delete account
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your organization
                    and all associated data.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" className="rounded-lg">
                    Cancel
                  </Button>
                  <Button variant="destructive" className="rounded-lg" disabled>
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Delete (coming soon)
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
