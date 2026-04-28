import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy — Rawaj',
}

const LAST_UPDATED = '2026-04-28'

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-extrabold text-ds-text tracking-tight font-headline mb-2">Privacy Policy</h1>
      <p className="text-sm text-ds-text-2 mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-sm max-w-none text-ds-text-2">
        <p>Rawaj AI (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the Rawaj platform. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service.</p>

        <h2 className="text-lg font-bold text-ds-text mt-6 mb-2">Information We Collect</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Identity:</strong> We use Clerk for authentication. Clerk processes your email, name, and profile picture.</li>
          <li><strong>Usage:</strong> We log AI generation requests and feature usage to improve the product.</li>
          <li><strong>Payments:</strong> Stripe handles payment information; we do not store card details.</li>
          <li><strong>Analytics:</strong> We use PostHog for anonymized product analytics.</li>
          <li><strong>Errors:</strong> We use Sentry for error tracking with PII scrubbing enabled.</li>
        </ul>

        <h2 className="text-lg font-bold text-ds-text mt-6 mb-2">Data Retention</h2>
        <p>We retain your data for as long as your account is active or as needed to provide you services. You can request deletion at any time by contacting us.</p>

        <h2 className="text-lg font-bold text-ds-text mt-6 mb-2">Contact</h2>
        <p>For privacy questions, email <a href="mailto:privacy@rawaj.ai" className="text-ds-primary hover:underline">privacy@rawaj.ai</a>.</p>
      </div>
    </div>
  )
}
