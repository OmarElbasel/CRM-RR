import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Rawaj',
}

const LAST_UPDATED = '2026-04-28'

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-extrabold text-ds-text tracking-tight font-headline mb-2">Terms of Service</h1>
      <p className="text-sm text-ds-text-2 mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-sm max-w-none text-ds-text-2">
        <p>By accessing or using Rawaj, you agree to be bound by these Terms of Service.</p>

        <h2 className="text-lg font-bold text-ds-text mt-6 mb-2">Use of Service</h2>
        <p>You may use Rawaj only for lawful purposes and in accordance with these Terms. You agree not to use the service in any way that could damage, disable, overburden, or impair the service.</p>

        <h2 className="text-lg font-bold text-ds-text mt-6 mb-2">Accounts</h2>
        <p>When you create an account, you must provide accurate and complete information. You are responsible for safeguarding your account credentials.</p>

        <h2 className="text-lg font-bold text-ds-text mt-6 mb-2">Termination</h2>
        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

        <h2 className="text-lg font-bold text-ds-text mt-6 mb-2">Contact</h2>
        <p>For terms questions, email <a href="mailto:legal@rawaj.ai" className="text-ds-primary hover:underline">legal@rawaj.ai</a>.</p>
      </div>
    </div>
  )
}
