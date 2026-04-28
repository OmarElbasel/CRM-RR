export interface DummyCaption {
  id: string
  platform: 'INSTAGRAM' | 'TIKTOK' | 'FACEBOOK'
  tone: string
  text: string
}

export interface DummyAdCopy {
  id: string
  headline: string
  body: string
  cta: string
}

export interface DummyTemplate {
  id: string
  name: string
  subject: string
  body: string
}

export const DUMMY_CAPTIONS: DummyCaption[] = [
  { id: '1', platform: 'INSTAGRAM', tone: 'Playful', text: 'Sunshine, smiles, and the perfect outfit. ☀️✨ #SummerVibes' },
  { id: '2', platform: 'TIKTOK', tone: 'Trendy', text: 'POV: You just found your new favorite fit. 👀✨' },
  { id: '3', platform: 'FACEBOOK', tone: 'Professional', text: 'Discover quality craftsmanship designed for the modern lifestyle.' },
]

export const DUMMY_AD_COPIES: DummyAdCopy[] = [
  { id: '1', headline: 'Upgrade Your Wardrobe', body: 'Premium fabrics, tailored fits, and styles that turn heads.', cta: 'Shop Now' },
  { id: '2', headline: 'Limited Time: 30% Off', body: 'Do not miss our biggest sale of the season. Ends Sunday.', cta: 'Claim Offer' },
  { id: '3', headline: 'Free Shipping Today', body: 'Order before midnight and get free express delivery.', cta: 'Order Now' },
]

export const DUMMY_BROADCAST_TEMPLATES: DummyTemplate[] = [
  { id: '1', name: 'Welcome New Subscriber', subject: 'Welcome to the family!', body: 'Hi {{name}}, thanks for joining us. Here is 10% off your first order.' },
  { id: '2', name: 'Abandoned Cart Reminder', subject: 'You left something behind', body: 'Hi {{name}}, your cart is waiting. Complete your order now.' },
  { id: '3', name: 'Order Shipped', subject: 'Your order is on its way', body: 'Hi {{name}}, great news! Your order #{{order_id}} has been shipped.' },
]
