import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import '../globals.css'
import { isEnabled } from '@/lib/flags'
import { AppShell } from '@/components/layout/AppShell'
import { TooltipProvider } from '@/components/ui/tooltip'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import { OrgGuard } from '@/components/layout/OrgGuard'

export const metadata: Metadata = {
  title: 'Rawaj — AI Product Description Generator',
  description: 'AI-powered product titles and descriptions for Gulf e-commerce',
}

/**
 * Root layout. Arabic-first by default (Constitution Principle III).
 * dir="rtl" and lang="ar" are the defaults.
 * The RTL toggle in src/lib/dir.ts can switch direction client-side without reload.
 *
 * NOTE: RTL layout pass is pending for Phase 4.5 components (Constitution Principle III tracked exception).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const showRedesign = isEnabled('UI_REDESIGN')

  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: '#4F46E5' } }}>
      <html lang="en" dir="ltr">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
          <link 
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
            rel="stylesheet" 
          />
        </head>
        <body className="antialiased">
          <TooltipProvider>
            <PostHogProvider>
              <OrgGuard>
                {showRedesign ? (
                  <AppShell>{children}</AppShell>
                ) : (
                  children
                )}
              </OrgGuard>
            </PostHogProvider>
          </TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
