export interface DummyThread {
  id: string
  contact_name: string
  platform: 'INSTAGRAM' | 'WHATSAPP' | 'FACEBOOK' | 'TIKTOK'
  last_message: string
  unread: boolean
  ai_intent: string
  ai_score: number
  updated_at: string
}

export const DUMMY_INBOX_THREADS: DummyThread[] = [
  {
    id: '1',
    contact_name: 'Ahmed Al-Rashid',
    platform: 'WHATSAPP',
    last_message: 'Do you have this in size medium?',
    unread: true,
    ai_intent: 'Product Inquiry',
    ai_score: 78,
    updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    contact_name: 'Sara Al-Qahtani',
    platform: 'INSTAGRAM',
    last_message: 'Thanks for the quick reply!',
    unread: false,
    ai_intent: 'Gratitude',
    ai_score: 45,
    updated_at: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    contact_name: 'Mohammed Al-Farsi',
    platform: 'FACEBOOK',
    last_message: 'What is the delivery time to Dubai?',
    unread: true,
    ai_intent: 'Shipping Inquiry',
    ai_score: 62,
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    contact_name: 'Fatima Al-Zahrani',
    platform: 'WHATSAPP',
    last_message: 'I would like to place a bulk order.',
    unread: false,
    ai_intent: 'Bulk Order',
    ai_score: 91,
    updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    contact_name: 'Khalid Al-Otaibi',
    platform: 'INSTAGRAM',
    last_message: 'Can you send me the catalog?',
    unread: true,
    ai_intent: 'Catalog Request',
    ai_score: 55,
    updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    contact_name: 'Noura Al-Shammari',
    platform: 'TIKTOK',
    last_message: 'Love your products!',
    unread: false,
    ai_intent: 'Compliment',
    ai_score: 30,
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    contact_name: 'Yousef Al-Harbi',
    platform: 'WHATSAPP',
    last_message: 'Is there a discount for first-time buyers?',
    unread: true,
    ai_intent: 'Discount Inquiry',
    ai_score: 68,
    updated_at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    contact_name: 'Lina Al-Ghamdi',
    platform: 'FACEBOOK',
    last_message: 'Please cancel my order #1024',
    unread: false,
    ai_intent: 'Cancellation',
    ai_score: 40,
    updated_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
]
