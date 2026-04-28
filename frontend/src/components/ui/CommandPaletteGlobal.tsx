'use client'

import { useEffect } from 'react'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { useCommandPalette } from '@/hooks/useCommandPalette'

export function CommandPaletteGlobal() {
  const { open, setOpen } = useCommandPalette()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setOpen])

  return <CommandPalette open={open} onOpenChange={setOpen} />
}
