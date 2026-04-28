'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-1 bg-paper-2 border border-ds-line rounded-lg p-0.5">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-md transition-colors ${theme === 'light' ? 'bg-white shadow-sm text-ds-text' : 'text-ds-text-3 hover:text-ds-text'}`}
        aria-label="Light mode"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'bg-white shadow-sm text-ds-text' : 'text-ds-text-3 hover:text-ds-text'}`}
        aria-label="Dark mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-md transition-colors ${theme === 'system' ? 'bg-white shadow-sm text-ds-text' : 'text-ds-text-3 hover:text-ds-text'}`}
        aria-label="System theme"
      >
        <Monitor className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
