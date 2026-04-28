import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rawaj — AI-powered CRM & growth engine for Gulf e-commerce',
  description: 'Rawaj unifies every customer conversation, scores every lead, and lets AI agents draft, qualify, and advance deals.',
  openGraph: {
    title: 'Rawaj — AI-powered CRM & growth engine',
    description: 'Unify conversations, track leads, and automate growth for Gulf e-commerce.',
    type: 'website',
  },
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ds-text font-display antialiased">
      {children}
    </div>
  )
}
