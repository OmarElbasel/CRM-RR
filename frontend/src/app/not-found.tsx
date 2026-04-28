import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { ArrowLeft } from 'lucide-react'

function BrandMark() {
  return (
    <div className="w-10 h-10 rounded-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #C8FE5E, #594FBF)' }}>
      <div className="absolute inset-[3px] rounded-lg bg-ink" />
      <div className="absolute left-1/2 top-[3px] bottom-[3px] w-[2px] bg-[#C8FE5E] z-[1]" />
    </div>
  )
}

export default async function NotFound() {
  const { userId } = await auth()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper px-6">
      <BrandMark />
      <h1 className="mt-6 text-3xl font-extrabold text-ds-text tracking-tight font-headline">
        We couldn't find that page
      </h1>
      <p className="mt-2 text-ds-text-2 max-w-sm text-center">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        href={userId ? '/dashboard' : '/'}
        className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-ds-primary text-white text-sm font-semibold hover:bg-ds-primary/90 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {userId ? 'Back to Dashboard' : 'Back to Home'}
      </Link>
    </div>
  )
}
