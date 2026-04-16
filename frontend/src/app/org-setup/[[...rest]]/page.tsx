'use client'

import { useState } from 'react'
import { useOrganizationList } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function OrgSetupPage() {
  const { createOrganization, setActive, isLoaded } = useOrganizationList({ userMemberships: true })
  const router = useRouter()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !createOrganization || !isLoaded) return
    setLoading(true)
    setError('')
    try {
      const org = await createOrganization({ name: name.trim() })
      await setActive!({ organization: org.id })
      // Hard reload so middleware reads the updated Clerk session cookie
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      console.error('Create org error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create workspace. Check if Organizations are enabled in your Clerk dashboard.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🚀</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create your workspace</h1>
          <p className="text-slate-400 text-sm">Give your store or business a name to get started</p>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. My Store, Layla Fashion..."
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
            required
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading || !name.trim() || !isLoaded}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-colors"
          >
            {loading ? 'Creating…' : 'Create Workspace'}
          </button>
        </form>
      </div>
    </div>
  )
}
