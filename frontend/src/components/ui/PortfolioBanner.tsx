import { DEMO_MODE } from '@/lib/demo'

/**
 * Top-of-page banner shown when the app runs in portfolio/demo mode.
 * Lets visitors know auth is bypassed and data is illustrative.
 */
export function PortfolioBanner() {
  if (!DEMO_MODE) return null
  return (
    <div className="bg-ds-accent text-ds-accent-ink text-[12.5px] font-medium px-4 py-1.5 text-center border-b border-black/10">
      Portfolio demo — sign-in is bypassed and all data is illustrative.{' '}
      <a
        href="https://github.com/OmarEbasel"
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2 hover:opacity-80"
      >
        View source on GitHub →
      </a>
    </div>
  )
}
