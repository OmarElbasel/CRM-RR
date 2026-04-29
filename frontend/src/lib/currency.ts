export type Currency = 'USD'

export function formatPrice(usd: number | null, _currency: Currency = 'USD'): string {
  if (usd === null) return 'Custom'
  if (usd === 0) return 'Free'
  return `$${usd}/mo`
}
