const RATES = { QAR: 3.64, SAR: 3.75 } as const

export function toQAR(usd: number): number {
  return Math.round(usd * RATES.QAR * 100) / 100
}

export function toSAR(usd: number): number {
  return Math.round(usd * RATES.SAR * 100) / 100
}

export function formatPrice(usd: number | null, currency: 'USD' | 'QAR' | 'SAR'): string {
  if (usd === null) return currency === 'USD' ? 'Custom' : 'تواصل معنا'
  if (usd === 0) return currency === 'USD' ? 'Free' : 'مجاني'
  const amount = currency === 'QAR' ? toQAR(usd) : currency === 'SAR' ? toSAR(usd) : usd
  return `${amount} ${currency}/mo`
}
