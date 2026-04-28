import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy — Rawaj',
}

const LAST_UPDATED = '2026-04-28'

export default function CookiesPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-extrabold text-ds-text tracking-tight font-headline mb-2">Cookie Policy</h1>
      <p className="text-sm text-ds-text-2 mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-sm max-w-none text-ds-text-2">
        <p>Rawaj uses cookies and similar technologies to operate and improve our service.</p>

        <h2 className="text-lg font-bold text-ds-text mt-6 mb-2">Essential Cookies</h2>
        <p>These cookies are necessary for the website to function and cannot be switched off in our systems.</p>

        <h2 className="text-lg font-bold text-ds-text mt-6 mb-2">Analytics Cookies</h2>
        <p>We use PostHog to understand how visitors interact with our website. These cookies collect information in an aggregated form.</p>

        <h2 className="text-lg font-bold text-ds-text mt-6 mb-2">Managing Cookies</h2>
        <p>You can set your browser to block or alert you about these cookies, but some parts of the site will not then work.</p>
      </div>
    </div>
  )
}
