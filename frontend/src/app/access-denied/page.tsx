import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Access Denied — Rawaj',
}

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper px-6">
      <h1 className="text-3xl font-extrabold text-ds-text tracking-tight font-headline">Access Denied</h1>
      <p className="mt-2 text-ds-text-2 max-w-sm text-center">
        You do not have permission to access this resource. If you believe this is an error, contact your organization administrator.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-ds-primary text-white text-sm font-semibold hover:bg-ds-primary/90 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  )
}
