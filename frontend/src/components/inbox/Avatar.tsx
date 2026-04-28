'use client'

import { useState } from 'react'

interface AvatarProps {
  name: string
  src?: string | null
  size?: number
  className?: string
}

export default function Avatar({ name, src, size = 40, className = '' }: AvatarProps) {
  const [errored, setErrored] = useState(false)
  const initial = (name?.trim() || '?').charAt(0).toUpperCase()
  const showImg = src && !errored

  const dim = { width: size, height: size, fontSize: Math.round(size * 0.4) }

  if (showImg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src!}
        alt={name}
        onError={() => setErrored(true)}
        style={dim}
        className={`rounded-full object-cover shrink-0 ${className}`}
      />
    )
  }

  return (
    <div
      style={dim}
      className={`rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold shrink-0 ${className}`}
    >
      {initial}
    </div>
  )
}
