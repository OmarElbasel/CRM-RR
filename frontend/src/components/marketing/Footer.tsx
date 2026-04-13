import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-lg font-display font-semibold text-white">Rawaj</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8 text-sm">
            <Link href="#" className="hover:text-white transition-colors cursor-pointer">
              Docs
            </Link>
            <Link href="#pricing" className="hover:text-white transition-colors cursor-pointer">
              Pricing
            </Link>
            <Link href="/sign-in" className="hover:text-white transition-colors cursor-pointer">
              Sign In
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Rawaj. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
