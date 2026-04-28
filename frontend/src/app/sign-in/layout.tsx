import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — Rawaj',
  description: 'Sign in to your Rawaj workspace.',
}

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper">
        {children}
      </body>
    </html>
  )
}
