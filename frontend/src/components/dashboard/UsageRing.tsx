'use client'

interface UsageRingProps {
  used: number
  limit: number | null   // null for Enterprise (unlimited)
  size?: number
}

export function UsageRing({ used, limit, size = 120 }: UsageRingProps) {
  if (limit === null) {
    // Enterprise: show full ring with infinity label
    return (
      <div className="flex flex-col items-center gap-2">
        <svg width={size} height={size} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle cx="60" cy="60" r="50" fill="none" stroke="#6366f1" strokeWidth="10" />
        </svg>
        <span className="text-sm font-medium text-gray-700">{used.toLocaleString()} / ∞</span>
      </div>
    )
  }

  const pct = Math.min(used / limit, 1)
  const r = 50
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - pct)
  const isNearLimit = pct >= 0.8

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx="60" cy="60" r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <circle
          cx="60" cy="60" r={r}
          fill="none"
          stroke={isNearLimit ? '#ef4444' : '#6366f1'}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
      </svg>
      <span className="text-sm font-medium text-gray-700">
        {used.toLocaleString()} / {limit.toLocaleString()}
      </span>
      <span className="text-xs text-gray-400">generations this month</span>
    </div>
  )
}
