import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Docs — Rawaj',
}

export default function DocsPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-extrabold text-ds-text tracking-tight font-headline mb-8">Documentation</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-bold text-ds-text mb-2">Getting Started</h2>
          <p className="text-ds-text-2 text-sm">
            Clone the repo, install dependencies, and run the backend and frontend locally. See{' '}
            <Link href="/" className="text-ds-primary hover:underline">README.md</Link> for the full guide.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ds-text mb-2">Channels</h2>
          <p className="text-ds-text-2 text-sm">
            Connect Instagram, WhatsApp, Facebook, TikTok, Shopify, Salla, and Zid. Read the{' '}
            <Link href="/docs/shopify-integration" className="text-ds-primary hover:underline">Shopify Integration Guide</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ds-text mb-2">AI</h2>
          <p className="text-ds-text-2 text-sm">
            Generate product descriptions, ad copy, and captions using our AI generation engine.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ds-text mb-2">API</h2>
          <p className="text-ds-text-2 text-sm">
            API documentation is available at <code className="bg-paper-2 px-1.5 py-0.5 rounded text-xs">/api/docs/</code> when running the backend locally.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ds-text mb-2">Self-hosting</h2>
          <p className="text-ds-text-2 text-sm">
            Deploy the frontend to Vercel and the backend to Railway. See the README for environment variables and one-click deploy buttons.
          </p>
        </section>
      </div>
    </div>
  )
}
