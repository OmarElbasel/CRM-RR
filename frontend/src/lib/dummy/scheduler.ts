export interface DummyBroadcast {
  id: string
  name: string
  status: 'draft' | 'scheduled' | 'sent'
  recipients: number
  scheduled_at?: string
}

export interface DummyScheduledPost {
  id: string
  platform: 'INSTAGRAM' | 'TIKTOK' | 'FACEBOOK'
  content: string
  scheduled_at: string
}

export const DUMMY_BROADCASTS: DummyBroadcast[] = [
  { id: '1', name: 'Spring Sale Announcement', status: 'scheduled', recipients: 1240, scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '2', name: 'New Collection Teaser', status: 'draft', recipients: 0 },
  { id: '3', name: 'Ramadan Offers', status: 'sent', recipients: 3500 },
  { id: '4', name: 'VIP Early Access', status: 'scheduled', recipients: 500, scheduled_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '5', name: 'Customer Feedback Survey', status: 'draft', recipients: 0 },
]

export const DUMMY_SCHEDULED_POSTS: DummyScheduledPost[] = [
  { id: '1', platform: 'INSTAGRAM', content: 'Introducing our new summer collection! 🌞', scheduled_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '2', platform: 'TIKTOK', content: 'Behind the scenes of our latest shoot 📹', scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '3', platform: 'FACEBOOK', content: 'Flash sale — 24 hours only!', scheduled_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '4', platform: 'INSTAGRAM', content: 'Customer spotlight: @sara.styles', scheduled_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '5', platform: 'TIKTOK', content: 'How to style our best-seller in 3 ways', scheduled_at: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '6', platform: 'FACEBOOK', content: 'We are hiring! Join our team 🚀', scheduled_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() },
]
