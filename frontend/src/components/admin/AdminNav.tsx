"use client";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

export function AdminNav() {
  const links = [
    { name: "Overview", href: "/admin" },
    { name: "Organizations", href: "/admin/orgs" },
    { name: "AI Usage", href: "/admin/ai-usage" },
    { name: "AI Config", href: "/admin/ai-config" },
    { name: "Rate Limits", href: "/admin/rate-limits" },
    { name: "Integrations", href: "/admin/integrations" },
  ];

  return (
    <nav className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="text-indigo-600 font-semibold text-lg">
            Rawaj Admin
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                // Ideally we'd highlight active link, but that requires 'use client' and usePathname
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Back to App
          </Link>
          <div className="h-8 w-px bg-gray-200" />
          <div className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
             <SignOutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
