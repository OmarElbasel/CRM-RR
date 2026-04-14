import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Rawaj AI — Supercharge Your Gulf E-Commerce',
  description:
    'Generate authentic Gulf Arabic product descriptions, unify your customer messages, and recover abandoned carts on autopilot. Built for Shopify, Salla, and Zid.',
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&family=Cairo:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-body bg-[#faf8ff] text-[#213156]">
        {children}
      </body>
    </html>
  );
}
