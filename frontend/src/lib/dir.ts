/**
 * RTL/LTR direction utilities. Constitution Principle III — Arabic-first.
 * Default direction is RTL (Arabic). LTR is the toggle-to state.
 */

export type Direction = 'ltr' | 'rtl'
const STORAGE_KEY = 'rawaj-dir'

/**
 * Set the document direction and language without a page reload.
 * Persists the choice in localStorage.
 */
export function setDocumentDir(dir: Direction): void {
  document.documentElement.setAttribute('dir', dir)
  document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en')
  try {
    localStorage.setItem(STORAGE_KEY, dir)
  } catch {
    // localStorage may be unavailable in sandboxed iframes
  }
}

/**
 * Get the initial direction from localStorage or default to RTL (Arabic-first).
 * Safe to call during SSR (returns 'rtl' when window is unavailable).
 */
export function getInitialDir(): Direction {
  if (typeof window === 'undefined') return 'rtl'
  try {
    return (localStorage.getItem(STORAGE_KEY) as Direction) ?? 'rtl'
  } catch {
    return 'rtl'
  }
}
