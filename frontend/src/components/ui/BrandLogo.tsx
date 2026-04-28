type Brand = 'instagram' | 'whatsapp' | 'facebook' | 'tiktok' | 'shopify' | 'salla' | 'zid'

export function BrandLogo({ brand, className }: { brand: Brand; className?: string }) {
  return <img src={`/brands/${brand}.svg`} alt={brand} className={className} />
}
