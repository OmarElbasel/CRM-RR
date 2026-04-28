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
          <circle cx="60" cy="60" r="50" fill="none" stroke="#E7E6DF" strokeWidth="10" />
          <circle cx="60" cy="60" r="50" fill="none" stroke="#594FBF" strokeWidth="10" />
        </svg>
        <span className="text-sm font-medium text-ds-text">{used.toLocaleString()} / ∞</span>
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
          stroke="#E7E6DF"
          strokeWidth="10"
        />
        <circle
          cx="60" cy="60" r={r}
          fill="none"
          stroke={isNearLimit ? '#E4573C' : '#594FBF'}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
      </svg>
      <span className="text-sm font-medium text-ds-text">
        {used.toLocaleString()} / {limit.toLocaleString()}
      </span>
      <span className="text-xs text-ds-text-3">generations this month</span>
    </div>
  )
}
