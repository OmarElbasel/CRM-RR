import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up — Rawaj',
  description: 'Create your Rawaj account.',
}

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper">
        {children}
      </body>
    </html>
  )
}
