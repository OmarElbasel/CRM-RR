import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Security — Rawaj',
}

const LAST_UPDATED = '2026-04-28'

export default function SecurityPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-extrabold text-ds-text tracking-tight font-headline mb-2">Security</h1>
      <p className="text-sm text-ds-text-2 mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-sm max-w-none text-ds-text-2">
        <p>We take security seriously. Here is how we protect your data.</p>

        <h2 className="text-lg font-bold text-ds-text mt-6 mb-2">Authentication</h2>
        <p>We use Clerk for secure authentication. Passwords are never stored on our servers.</p>

        <h2 className="text-lg font-bold text-ds-text mt-6 mb-2">Encryption</h2>
        <p>Platform credentials (API keys, tokens) are encrypted at rest using Fernet (AES-128 in CBC mode via Python cryptography).</p>

        <h2 className="text-lg font-bold text-ds-text mt-6 mb-2">Payments</h2>
        <p>All payment processing is handled by Stripe. We never store card details.</p>

        <h2 className="text-lg font-bold text-ds-text mt-6 mb-2">Monitoring</h2>
        <p>We use Sentry for error tracking with PII scrubbing enabled to ensure sensitive data is not logged.</p>

        <h2 className="text-lg font-bold text-ds-text mt-6 mb-2">Reporting Issues</h2>
        <p>If you discover a security vulnerability, please email <a href="mailto:security@rawaj.ai" className="text-ds-primary hover:underline">security@rawaj.ai</a>.</p>
      </div>
    </div>
  )
}
