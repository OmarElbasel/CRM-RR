import type { PipelineBoardData } from '@/components/pipeline/PipelineBoard'

interface DealDetail {
  id: number
  title: string
  stage: string
  priority: string
  value: string | null
  ai_score: number
  assigned_to: { clerk_user_id: string; name: string }
  contact: { id: number; name: string; platform: string; platform_id: string; ai_score: number; total_spend: string } | null
  notes: string
  lost_reason: string
  due_at: string | null
  closed_at: string | null
  messages: { id: number; direction: string; content: string; intent: string | null; sent_at: string }[]
  tasks: { id: number; title: string; description: string; due_at: string | null; completed_at: string | null; assigned_to: { clerk_user_id: string; name: string } }[]
  notifications: { id: number; notification_type: string; priority: string; title: string; body: string; body_ar: string; draft_en: string; draft_ar: string; read_at: string | null; created_at: string }[]
}

function stub(id: number, title: string, stage: string, priority: string, value: string | null, score: number, contact: DealDetail['contact']): DealDetail {
  return { id, title, stage, priority, value, ai_score: score, assigned_to: { clerk_user_id: 'user_demo1', name: 'Lina' }, contact, notes: '', lost_reason: '', due_at: null, closed_at: null, messages: [], tasks: [], notifications: [] }
}

export const DUMMY_DEAL_DETAILS: Record<number, DealDetail> = {
  1: {
    id: 1,
    title: 'Fatima — Spring abaya collection',
    stage: 'NEW_MESSAGE',
    priority: 'HIGH',
    value: '1800',
    ai_score: 82,
    assigned_to: { clerk_user_id: 'user_demo1', name: 'Lina' },
    contact: { id: 1, name: 'Fatima Al-Shamri', platform: 'INSTAGRAM', platform_id: '@fatima.shamari', ai_score: 82, total_spend: '0' },
    notes: 'New customer — interested in the spring abaya line.',
    lost_reason: '',
    due_at: '2026-04-20T17:00:00Z',
    closed_at: null,
    messages: [
      { id: 1, direction: 'INBOUND', content: 'Hi! I saw your spring collection — do you have larger sizes?', intent: 'PRICE_INQUIRY', sent_at: '2026-04-13T14:22:00Z' },
    ],
    tasks: [
      { id: 1, title: 'Send size catalog', description: '', due_at: '2026-04-14T12:00:00Z', completed_at: null, assigned_to: { clerk_user_id: 'user_demo1', name: 'Lina' } },
    ],
    notifications: [
      { id: 1, notification_type: 'new_message', priority: 'HIGH', title: 'New message from Fatima', body: 'The customer asked about plus sizes in the spring collection.', body_ar: '', draft_en: 'Hi Fatima! Yes, we have sizes up to 60. Would you like to see the full catalog?', draft_ar: '', read_at: null, created_at: '2026-04-13T14:25:00Z' },
    ],
  },
  4: {
    id: 4,
    title: 'Abdullah — full majlis renovation',
    stage: 'ENGAGED',
    priority: 'URGENT',
    value: '12000',
    ai_score: 91,
    assigned_to: { clerk_user_id: 'user_demo2', name: 'Mohammed' },
    contact: { id: 4, name: 'Abdullah Al-Rashid', platform: 'WHATSAPP', platform_id: '+966501234567', ai_score: 91, total_spend: '8500' },
    notes: 'VIP customer — bought a majlis set two years ago. Looking to renovate the whole room.',
    lost_reason: '',
    due_at: '2026-04-18T15:00:00Z',
    closed_at: null,
    messages: [
      { id: 10, direction: 'OUTBOUND', content: 'Hi Abdullah, how are you? How can we help today?', intent: null, sent_at: '2026-04-12T10:00:00Z' },
      { id: 11, direction: 'INBOUND', content: 'I want to renovate the whole majlis — can you send me the catalog?', intent: 'READY_TO_BUY', sent_at: '2026-04-12T16:30:00Z' },
      { id: 12, direction: 'OUTBOUND', content: 'Of course! I just sent the catalog — we have 3 new collections this season.', intent: null, sent_at: '2026-04-12T17:00:00Z' },
    ],
    tasks: [
      { id: 2, title: 'Send full majlis quote', description: 'Includes: sofa, cushions, coffee table.', due_at: '2026-04-14T10:00:00Z', completed_at: null, assigned_to: { clerk_user_id: 'user_demo2', name: 'Mohammed' } },
      { id: 3, title: 'Schedule home visit', description: '', due_at: '2026-04-16T14:00:00Z', completed_at: null, assigned_to: { clerk_user_id: 'user_demo2', name: 'Mohammed' } },
    ],
    notifications: [
      { id: 2, notification_type: 'hot_lead', priority: 'URGENT', title: 'Customer ready to buy', body: 'Abdullah explicitly said he wants to renew the full majlis. High probability of closing.', body_ar: '', draft_en: 'Abdullah, I\'ve prepared a custom quote for your majlis renovation. Shall I send it over?', draft_ar: '', read_at: null, created_at: '2026-04-12T17:05:00Z' },
    ],
  },
  8: {
    id: 8,
    title: 'Maryam — VIP handbag collection',
    stage: 'PRICE_SENT',
    priority: 'URGENT',
    value: '22000',
    ai_score: 93,
    assigned_to: { clerk_user_id: 'user_demo2', name: 'Mohammed' },
    contact: { id: 8, name: 'Maryam Al-Kaabi', platform: 'INSTAGRAM', platform_id: '@maryam.kaabi', ai_score: 93, total_spend: '31000' },
    notes: 'VIP customer — orders every season. Asked for a custom handbag bundle.',
    lost_reason: '',
    due_at: '2026-04-15T23:59:00Z',
    closed_at: null,
    messages: [
      { id: 20, direction: 'INBOUND', content: 'Got the invoice, thanks. I\'ll send the transfer tomorrow.', intent: 'READY_TO_BUY', sent_at: '2026-04-10T20:00:00Z' },
      { id: 21, direction: 'OUTBOUND', content: 'Perfect! Standing by for the transfer. Let me know if you need anything.', intent: null, sent_at: '2026-04-10T20:15:00Z' },
    ],
    tasks: [
      { id: 4, title: 'Follow up on bank transfer', description: '', due_at: '2026-04-15T12:00:00Z', completed_at: null, assigned_to: { clerk_user_id: 'user_demo2', name: 'Mohammed' } },
    ],
    notifications: [
      { id: 3, notification_type: 'follow_up', priority: 'HIGH', title: 'Follow-up required — payment pending', body: 'Maryam said she would transfer tomorrow. It\'s been 3 days — a follow-up is recommended.', body_ar: '', draft_en: 'Hi Maryam, just checking in on the order. Let me know if you need anything!', draft_ar: '', read_at: null, created_at: '2026-04-13T09:00:00Z' },
    ],
  },
  2: stub(2, 'Khalid — premium coffee set', 'NEW_MESSAGE', 'MEDIUM', '4200', 64, { id: 2, name: 'Khalid Al-Dosari', platform: 'WHATSAPP', platform_id: '+965512345678', ai_score: 64, total_spend: '2200' }),
  3: stub(3, 'Noura — perfume inquiry', 'NEW_MESSAGE', 'LOW', null, 38, { id: 3, name: 'Noura Al-Qahtani', platform: 'INSTAGRAM', platform_id: '@noura.q', ai_score: 38, total_spend: '0' }),
  5: stub(5, 'Reem — bridal home setup', 'ENGAGED', 'HIGH', '28000', 78, { id: 5, name: 'Reem Al-Zahrani', platform: 'INSTAGRAM', platform_id: '@reem.zahrani', ai_score: 78, total_spend: '5000' }),
  6: stub(6, 'Salma — hospitality essentials', 'ENGAGED', 'MEDIUM', '3500', 55, { id: 6, name: 'Salma Al-Omari', platform: 'FACEBOOK', platform_id: 'salma.omari', ai_score: 55, total_spend: '1200' }),
  7: stub(7, 'Yousef — groom\'s bisht & accessories', 'PRICE_SENT', 'HIGH', '8500', 87, { id: 7, name: 'Yousef Al-Balushi', platform: 'WHATSAPP', platform_id: '+968912345678', ai_score: 87, total_spend: '12000' }),
  9: stub(9, 'Turki — monthly coffee subscription', 'ORDER_PLACED', 'MEDIUM', '2400', 72, { id: 9, name: 'Turki Al-Subaie', platform: 'WHATSAPP', platform_id: '+966551234567', ai_score: 72, total_spend: '9600' }),
  10: stub(10, 'Hessa — seasonal kids\' clothing', 'ORDER_PLACED', 'LOW', '950', 45, { id: 10, name: 'Hessa Al-Mutairi', platform: 'INSTAGRAM', platform_id: '@hessa.mutairi', ai_score: 45, total_spend: '450' }),
  11: stub(11, 'Bader — luxury watch', 'PAID', 'HIGH', '15000', 95, { id: 11, name: 'Bader Al-Harbi', platform: 'WHATSAPP', platform_id: '+966501112233', ai_score: 95, total_spend: '28000' }),
  12: stub(12, 'Ahmed — corporate fragrance order', 'PAID', 'MEDIUM', '9800', 80, { id: 12, name: 'Ahmed Al-Mansouri', platform: 'FACEBOOK', platform_id: 'ahmed.mansouri', ai_score: 80, total_spend: '15000' }),
  13: { ...stub(13, 'Omar — wholesale price inquiry', 'LOST', 'LOW', '3000', 30, { id: 13, name: 'Omar Al-Ghamdi', platform: 'WHATSAPP', platform_id: '+966509876543', ai_score: 30, total_spend: '0' }), lost_reason: 'Found a cheaper price with a competitor.' },
  14: { ...stub(14, 'Waleed — custom design request', 'LOST', 'LOW', '1000', 33, { id: 14, name: 'Waleed Al-Hamdan', platform: 'INSTAGRAM', platform_id: '@waleed.hamdan', ai_score: 33, total_spend: '0' }), lost_reason: 'No longer needs the product.' },
}

export const DUMMY_PIPELINE_DATA: PipelineBoardData = {
  aggregate_total_value: '312500.00',
  applied_filters: {},
  stages: [
    {
      stage: 'NEW_MESSAGE',
      label: 'New Message',
      total_value: '35000.00',
      count: 3,
      deals: [
        {
          id: 1,
          title: 'Fatima — Spring abaya collection',
          contact: { id: 1, name: 'Fatima Al-Shamri', platform: 'INSTAGRAM' },
          value: '1800',
          priority: 'HIGH',
          ai_score: 82,
          assigned_to: { clerk_user_id: 'user_demo1', name: 'Lina' },
          latest_message_preview: 'Hi! I saw your spring collection — do you have larger sizes?',
          last_customer_message_at: '2026-04-13T14:22:00Z',
          has_unread_alert: true,
        },
        {
          id: 2,
          title: 'Khalid — premium coffee set',
          contact: { id: 2, name: 'Khalid Al-Dosari', platform: 'WHATSAPP' },
          value: '4200',
          priority: 'MEDIUM',
          ai_score: 64,
          assigned_to: { clerk_user_id: 'user_demo2', name: 'Mohammed' },
          latest_message_preview: 'I need a coffee set for gifting — what\'s the price?',
          last_customer_message_at: '2026-04-13T11:05:00Z',
          has_unread_alert: false,
        },
        {
          id: 3,
          title: 'Noura — perfume inquiry',
          contact: { id: 3, name: 'Noura Al-Qahtani', platform: 'INSTAGRAM' },
          value: null,
          priority: 'LOW',
          ai_score: 38,
          assigned_to: { clerk_user_id: 'user_demo1', name: 'Lina' },
          latest_message_preview: 'Where can I find your rose perfume?',
          last_customer_message_at: '2026-04-13T09:50:00Z',
          has_unread_alert: false,
        },
      ],
    },
    {
      stage: 'ENGAGED',
      label: 'Engaged',
      total_value: '78500.00',
      count: 3,
      deals: [
        {
          id: 4,
          title: 'Abdullah — full majlis renovation',
          contact: { id: 4, name: 'Abdullah Al-Rashid', platform: 'WHATSAPP' },
          value: '12000',
          priority: 'URGENT',
          ai_score: 91,
          assigned_to: { clerk_user_id: 'user_demo2', name: 'Mohammed' },
          latest_message_preview: 'Great, send me the full catalog please.',
          last_customer_message_at: '2026-04-12T16:30:00Z',
          has_unread_alert: true,
        },
        {
          id: 5,
          title: 'Reem — bridal home setup',
          contact: { id: 5, name: 'Reem Al-Zahrani', platform: 'INSTAGRAM' },
          value: '28000',
          priority: 'HIGH',
          ai_score: 78,
          assigned_to: { clerk_user_id: 'user_demo1', name: 'Lina' },
          latest_message_preview: 'I\'d love to see your full bridal setup packages.',
          last_customer_message_at: '2026-04-12T13:00:00Z',
          has_unread_alert: false,
        },
        {
          id: 6,
          title: 'Salma — hospitality essentials',
          contact: { id: 6, name: 'Salma Al-Omari', platform: 'FACEBOOK' },
          value: '3500',
          priority: 'MEDIUM',
          ai_score: 55,
          assigned_to: { clerk_user_id: 'user_demo2', name: 'Mohammed' },
          latest_message_preview: 'I\'m hosting an event next week — I need a hospitality set.',
          last_customer_message_at: '2026-04-11T18:00:00Z',
          has_unread_alert: false,
        },
      ],
    },
    {
      stage: 'PRICE_SENT',
      label: 'Price Sent',
      total_value: '92000.00',
      count: 2,
      deals: [
        {
          id: 7,
          title: 'Yousef — groom\'s bisht & accessories',
          contact: { id: 7, name: 'Yousef Al-Balushi', platform: 'WHATSAPP' },
          value: '8500',
          priority: 'HIGH',
          ai_score: 87,
          assigned_to: { clerk_user_id: 'user_demo1', name: 'Lina' },
          latest_message_preview: 'The price is reasonable, but I\'d like to see the fabrics first.',
          last_customer_message_at: '2026-04-11T10:15:00Z',
          has_unread_alert: false,
        },
        {
          id: 8,
          title: 'Maryam — VIP handbag collection',
          contact: { id: 8, name: 'Maryam Al-Kaabi', platform: 'INSTAGRAM' },
          value: '22000',
          priority: 'URGENT',
          ai_score: 93,
          assigned_to: { clerk_user_id: 'user_demo2', name: 'Mohammed' },
          latest_message_preview: 'Send me the invoice and I\'ll do the transfer.',
          last_customer_message_at: '2026-04-10T20:00:00Z',
          has_unread_alert: true,
        },
      ],
    },
    {
      stage: 'ORDER_PLACED',
      label: 'Order Placed',
      total_value: '65000.00',
      count: 2,
      deals: [
        {
          id: 9,
          title: 'Turki — monthly coffee subscription',
          contact: { id: 9, name: 'Turki Al-Subaie', platform: 'WHATSAPP' },
          value: '2400',
          priority: 'MEDIUM',
          ai_score: 72,
          assigned_to: { clerk_user_id: 'user_demo1', name: 'Lina' },
          latest_message_preview: 'Transfer done — when will it arrive?',
          last_customer_message_at: '2026-04-09T12:00:00Z',
          has_unread_alert: false,
        },
        {
          id: 10,
          title: 'Hessa — seasonal kids\' clothing',
          contact: { id: 10, name: 'Hessa Al-Mutairi', platform: 'INSTAGRAM' },
          value: '950',
          priority: 'LOW',
          ai_score: 45,
          assigned_to: { clerk_user_id: 'user_demo2', name: 'Mohammed' },
          latest_message_preview: 'WhatsApp me when it\'s ready.',
          last_customer_message_at: '2026-04-08T15:30:00Z',
          has_unread_alert: false,
        },
      ],
    },
    {
      stage: 'PAID',
      label: 'Paid',
      total_value: '38000.00',
      count: 2,
      deals: [
        {
          id: 11,
          title: 'Bader — luxury watch',
          contact: { id: 11, name: 'Bader Al-Harbi', platform: 'WHATSAPP' },
          value: '15000',
          priority: 'HIGH',
          ai_score: 95,
          assigned_to: { clerk_user_id: 'user_demo1', name: 'Lina' },
          latest_message_preview: 'The watch arrived — thank you so much!',
          last_customer_message_at: '2026-04-07T09:00:00Z',
          has_unread_alert: false,
        },
        {
          id: 12,
          title: 'Ahmed — corporate fragrance order',
          contact: { id: 12, name: 'Ahmed Al-Mansouri', platform: 'FACEBOOK' },
          value: '9800',
          priority: 'MEDIUM',
          ai_score: 80,
          assigned_to: { clerk_user_id: 'user_demo2', name: 'Mohammed' },
          latest_message_preview: 'Need the invoice for accounting, please.',
          last_customer_message_at: '2026-04-06T11:00:00Z',
          has_unread_alert: false,
        },
      ],
    },
    {
      stage: 'LOST',
      label: 'Lost',
      total_value: '4000.00',
      count: 2,
      deals: [
        {
          id: 13,
          title: 'Omar — wholesale price inquiry',
          contact: { id: 13, name: 'Omar Al-Ghamdi', platform: 'WHATSAPP' },
          value: '3000',
          priority: 'LOW',
          ai_score: 30,
          assigned_to: { clerk_user_id: 'user_demo1', name: 'Lina' },
          latest_message_preview: 'Found a cheaper price elsewhere.',
          last_customer_message_at: '2026-04-05T14:00:00Z',
          has_unread_alert: false,
        },
        {
          id: 14,
          title: 'Waleed — custom design request',
          contact: { id: 14, name: 'Waleed Al-Hamdan', platform: 'INSTAGRAM' },
          value: '1000',
          priority: 'LOW',
          ai_score: 33,
          assigned_to: { clerk_user_id: 'user_demo2', name: 'Mohammed' },
          latest_message_preview: 'No longer needed, thanks.',
          last_customer_message_at: '2026-04-04T16:00:00Z',
          has_unread_alert: false,
        },
      ],
    },
  ],
}
