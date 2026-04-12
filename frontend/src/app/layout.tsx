import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rawaj — AI Product Description Generator',
  description: 'AI-powered product titles and descriptions for Gulf e-commerce',
}

/**
 * Root layout. Arabic-first by default (Constitution Principle III).
 * dir="rtl" and lang="ar" are the defaults.
 * The RTL toggle in src/lib/dir.ts can switch direction client-side without reload.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="ar" dir="rtl">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
