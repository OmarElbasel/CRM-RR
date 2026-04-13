import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Rawaj — AI Product Descriptions for Gulf Commerce',
  description:
    'Generate compelling product titles and descriptions in Arabic and English, built for Shopify, Salla, and Zid merchants in the Gulf region.',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
