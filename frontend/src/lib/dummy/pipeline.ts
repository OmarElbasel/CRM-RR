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
  return { id, title, stage, priority, value, ai_score: score, assigned_to: { clerk_user_id: 'user_demo1', name: 'لينا' }, contact, notes: '', lost_reason: '', due_at: null, closed_at: null, messages: [], tasks: [], notifications: [] }
}

export const DUMMY_DEAL_DETAILS: Record<number, DealDetail> = {
  1: {
    id: 1,
    title: 'فاطمة — عباية مجموعة الربيع',
    stage: 'NEW_MESSAGE',
    priority: 'HIGH',
    value: '1800',
    ai_score: 82,
    assigned_to: { clerk_user_id: 'user_demo1', name: 'لينا' },
    contact: { id: 1, name: 'فاطمة الشمري', platform: 'INSTAGRAM', platform_id: '@fatima.shamari', ai_score: 82, total_spend: '0' },
    notes: 'عميلة جديدة — مهتمة بالعبايات الربيعية',
    lost_reason: '',
    due_at: '2026-04-20T17:00:00Z',
    closed_at: null,
    messages: [
      { id: 1, direction: 'INBOUND', content: 'السلام عليكم، شفت كولكشن الربيع — في مقاسات كبيرة؟', intent: 'PRICE_INQUIRY', sent_at: '2026-04-13T14:22:00Z' },
    ],
    tasks: [
      { id: 1, title: 'إرسال كتالوج المقاسات', description: '', due_at: '2026-04-14T12:00:00Z', completed_at: null, assigned_to: { clerk_user_id: 'user_demo1', name: 'لينا' } },
    ],
    notifications: [
      { id: 1, notification_type: 'new_message', priority: 'HIGH', title: 'رسالة جديدة من فاطمة', body: 'The customer asked about plus sizes in the spring collection.', body_ar: 'العميلة تسأل عن المقاسات الكبيرة في كولكشن الربيع.', draft_en: 'Hi Fatima! Yes, we have sizes up to 60. Would you like to see the full catalog?', draft_ar: 'أهلاً فاطمة! نعم عندنا مقاسات حتى 60. تبين أشوفيلك الكتالوج كامل؟', read_at: null, created_at: '2026-04-13T14:25:00Z' },
    ],
  },
  4: {
    id: 4,
    title: 'عبدالله — جلسة مجلس كاملة',
    stage: 'ENGAGED',
    priority: 'URGENT',
    value: '12000',
    ai_score: 91,
    assigned_to: { clerk_user_id: 'user_demo2', name: 'محمد' },
    contact: { id: 4, name: 'عبدالله الرشيد', platform: 'WHATSAPP', platform_id: '+966501234567', ai_score: 91, total_spend: '8500' },
    notes: 'عميل VIP — اشترى جلسة قبل سنتين. يريد تجديد المجلس كامل.',
    lost_reason: '',
    due_at: '2026-04-18T15:00:00Z',
    closed_at: null,
    messages: [
      { id: 10, direction: 'OUTBOUND', content: 'أهلاً عبدالله، كيف حالك؟ كيف نقدر نساعدك؟', intent: null, sent_at: '2026-04-12T10:00:00Z' },
      { id: 11, direction: 'INBOUND', content: 'الحين أبي أجدد المجلس كامل، أرسل لي الكتالوج', intent: 'READY_TO_BUY', sent_at: '2026-04-12T16:30:00Z' },
      { id: 12, direction: 'OUTBOUND', content: 'بالتأكيد! راسلتك الكتالوج — عندنا 3 مجموعات جديدة لهذا الموسم.', intent: null, sent_at: '2026-04-12T17:00:00Z' },
    ],
    tasks: [
      { id: 2, title: 'إرسال عرض سعر جلسة مجلس كامل', description: 'يشمل: أريكة، وسائد، طاولة قهوة', due_at: '2026-04-14T10:00:00Z', completed_at: null, assigned_to: { clerk_user_id: 'user_demo2', name: 'محمد' } },
      { id: 3, title: 'موعد معاينة في المنزل', description: '', due_at: '2026-04-16T14:00:00Z', completed_at: null, assigned_to: { clerk_user_id: 'user_demo2', name: 'محمد' } },
    ],
    notifications: [
      { id: 2, notification_type: 'hot_lead', priority: 'URGENT', title: 'عميل جاهز للشراء', body: 'Abdullah explicitly said he wants to renew the full majlis. High probability of closing.', body_ar: 'عبدالله صرّح بنيته لتجديد المجلس كامل. احتمال الإغلاق عالي جداً.', draft_en: 'Abdullah, I\'ve prepared a custom quote for your majlis renewal. Shall I send it over?', draft_ar: 'عبدالله، جهّزت لك عرض سعر خاص لتجديد المجلس. تبي أرسله لك؟', read_at: null, created_at: '2026-04-12T17:05:00Z' },
    ],
  },
  8: {
    id: 8,
    title: 'مريم — حقائب مجموعة VIP',
    stage: 'PRICE_SENT',
    priority: 'URGENT',
    value: '22000',
    ai_score: 93,
    assigned_to: { clerk_user_id: 'user_demo2', name: 'محمد' },
    contact: { id: 8, name: 'مريم الكعبي', platform: 'INSTAGRAM', platform_id: '@maryam.kaabi', ai_score: 93, total_spend: '31000' },
    notes: 'عميلة VIP — تشتري بشكل منتظم كل موسم. طلبت مجموعة حقائب خاصة.',
    lost_reason: '',
    due_at: '2026-04-15T23:59:00Z',
    closed_at: null,
    messages: [
      { id: 20, direction: 'INBOUND', content: 'وصلت الفاتورة، شكراً. راح أسوي التحويل بكرة', intent: 'READY_TO_BUY', sent_at: '2026-04-10T20:00:00Z' },
      { id: 21, direction: 'OUTBOUND', content: 'ممتاز! بانتظار التحويل. إذا تحتاجين أي شيء أنا موجود.', intent: null, sent_at: '2026-04-10T20:15:00Z' },
    ],
    tasks: [
      { id: 4, title: 'متابعة التحويل البنكي', description: '', due_at: '2026-04-15T12:00:00Z', completed_at: null, assigned_to: { clerk_user_id: 'user_demo2', name: 'محمد' } },
    ],
    notifications: [
      { id: 3, notification_type: 'follow_up', priority: 'HIGH', title: 'متابعة مطلوبة — لم يتم الدفع', body: 'Maryam said she would transfer tomorrow. It\'s been 3 days — a follow-up is recommended.', body_ar: 'مريم قالت راح تحول بكرة — مضى 3 أيام. يُنصح بالمتابعة.', draft_en: 'Hi Maryam, just checking in on the order. Let me know if you need anything!', draft_ar: 'أهلاً مريم، فقط أتابع معك — هل تحتاجين أي مساعدة؟', read_at: null, created_at: '2026-04-13T09:00:00Z' },
    ],
  },
  2: stub(2, 'خالد — طقم قهوة فاخر', 'NEW_MESSAGE', 'MEDIUM', '4200', 64, { id: 2, name: 'خالد الدوسري', platform: 'WHATSAPP', platform_id: '+965512345678', ai_score: 64, total_spend: '2200' }),
  3: stub(3, 'نورة — استفسار عطور', 'NEW_MESSAGE', 'LOW', null, 38, { id: 3, name: 'نورة القحطاني', platform: 'INSTAGRAM', platform_id: '@noura.q', ai_score: 38, total_spend: '0' }),
  5: stub(5, 'ريم — تجهيز بيت العروس', 'ENGAGED', 'HIGH', '28000', 78, { id: 5, name: 'ريم الزهراني', platform: 'INSTAGRAM', platform_id: '@reem.zahrani', ai_score: 78, total_spend: '5000' }),
  6: stub(6, 'سلمى — مستلزمات ضيافة', 'ENGAGED', 'MEDIUM', '3500', 55, { id: 6, name: 'سلمى العمري', platform: 'FACEBOOK', platform_id: 'salma.omari', ai_score: 55, total_spend: '1200' }),
  7: stub(7, 'يوسف — بشت عريس وإكسسوارات', 'PRICE_SENT', 'HIGH', '8500', 87, { id: 7, name: 'يوسف البلوشي', platform: 'WHATSAPP', platform_id: '+968912345678', ai_score: 87, total_spend: '12000' }),
  9: stub(9, 'تركي — طلب قهوة شهري', 'ORDER_PLACED', 'MEDIUM', '2400', 72, { id: 9, name: 'تركي السبيعي', platform: 'WHATSAPP', platform_id: '+966551234567', ai_score: 72, total_spend: '9600' }),
  10: stub(10, 'حصة — ملابس أطفال موسمية', 'ORDER_PLACED', 'LOW', '950', 45, { id: 10, name: 'حصة المطيري', platform: 'INSTAGRAM', platform_id: '@hessa.mutairi', ai_score: 45, total_spend: '450' }),
  11: stub(11, 'بدر — ساعة فاخرة', 'PAID', 'HIGH', '15000', 95, { id: 11, name: 'بدر الحربي', platform: 'WHATSAPP', platform_id: '+966501112233', ai_score: 95, total_spend: '28000' }),
  12: stub(12, 'أحمد — طلب عطور شركة', 'PAID', 'MEDIUM', '9800', 80, { id: 12, name: 'أحمد المنصوري', platform: 'FACEBOOK', platform_id: 'ahmed.mansouri', ai_score: 80, total_spend: '15000' }),
  13: { ...stub(13, 'عمر — استفسار أسعار جملة', 'LOST', 'LOW', '3000', 30, { id: 13, name: 'عمر الغامدي', platform: 'WHATSAPP', platform_id: '+966509876543', ai_score: 30, total_spend: '0' }), lost_reason: 'وجد سعر أرخص عند المنافس' },
  14: { ...stub(14, 'وليد — طلب تصميم خاص', 'LOST', 'LOW', '1000', 33, { id: 14, name: 'وليد الحمدان', platform: 'INSTAGRAM', platform_id: '@waleed.hamdan', ai_score: 33, total_spend: '0' }), lost_reason: 'لم يعد محتاجاً للمنتج' },
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
          title: 'فاطمة — عباية مجموعة الربيع',
          contact: { id: 1, name: 'فاطمة الشمري', platform: 'INSTAGRAM' },
          value: '1800',
          priority: 'HIGH',
          ai_score: 82,
          assigned_to: { clerk_user_id: 'user_demo1', name: 'لينا' },
          latest_message_preview: 'السلام عليكم، شفت كولكشن الربيع — في مقاسات كبيرة؟',
          last_customer_message_at: '2026-04-13T14:22:00Z',
          has_unread_alert: true,
        },
        {
          id: 2,
          title: 'خالد — طقم قهوة فاخر',
          contact: { id: 2, name: 'خالد الدوسري', platform: 'WHATSAPP' },
          value: '4200',
          priority: 'MEDIUM',
          ai_score: 64,
          assigned_to: { clerk_user_id: 'user_demo2', name: 'محمد' },
          latest_message_preview: 'بدي طقم قهوة للهدايا، كم السعر؟',
          last_customer_message_at: '2026-04-13T11:05:00Z',
          has_unread_alert: false,
        },
        {
          id: 3,
          title: 'نورة — استفسار عطور',
          contact: { id: 3, name: 'نورة القحطاني', platform: 'INSTAGRAM' },
          value: null,
          priority: 'LOW',
          ai_score: 38,
          assigned_to: { clerk_user_id: 'user_demo1', name: 'لينا' },
          latest_message_preview: 'وين أحصل على عطر الورد؟',
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
          title: 'عبدالله — جلسة مجلس كاملة',
          contact: { id: 4, name: 'عبدالله الرشيد', platform: 'WHATSAPP' },
          value: '12000',
          priority: 'URGENT',
          ai_score: 91,
          assigned_to: { clerk_user_id: 'user_demo2', name: 'محمد' },
          latest_message_preview: 'ممتاز، أرسل لي الكتالوج كامل',
          last_customer_message_at: '2026-04-12T16:30:00Z',
          has_unread_alert: true,
        },
        {
          id: 5,
          title: 'ريم — تجهيز بيت العروس',
          contact: { id: 5, name: 'ريم الزهراني', platform: 'INSTAGRAM' },
          value: '28000',
          priority: 'HIGH',
          ai_score: 78,
          assigned_to: { clerk_user_id: 'user_demo1', name: 'لينا' },
          latest_message_preview: 'حابة أشوف باقات التجهيز الكاملة',
          last_customer_message_at: '2026-04-12T13:00:00Z',
          has_unread_alert: false,
        },
        {
          id: 6,
          title: 'سلمى — مستلزمات ضيافة',
          contact: { id: 6, name: 'سلمى العمري', platform: 'FACEBOOK' },
          value: '3500',
          priority: 'MEDIUM',
          ai_score: 55,
          assigned_to: { clerk_user_id: 'user_demo2', name: 'محمد' },
          latest_message_preview: 'عندي فعالية الأسبوع الجاي، محتاجة طقم ضيافة',
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
          title: 'يوسف — بشت عريس وإكسسوارات',
          contact: { id: 7, name: 'يوسف البلوشي', platform: 'WHATSAPP' },
          value: '8500',
          priority: 'HIGH',
          ai_score: 87,
          assigned_to: { clerk_user_id: 'user_demo1', name: 'لينا' },
          latest_message_preview: 'السعر معقول، بس أبي أشوف الأقمشة أول',
          last_customer_message_at: '2026-04-11T10:15:00Z',
          has_unread_alert: false,
        },
        {
          id: 8,
          title: 'مريم — حقائب مجموعة VIP',
          contact: { id: 8, name: 'مريم الكعبي', platform: 'INSTAGRAM' },
          value: '22000',
          priority: 'URGENT',
          ai_score: 93,
          assigned_to: { clerk_user_id: 'user_demo2', name: 'محمد' },
          latest_message_preview: 'ابعثيلي الفاتورة وأسوي التحويل',
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
          title: 'تركي — طلب قهوة شهري',
          contact: { id: 9, name: 'تركي السبيعي', platform: 'WHATSAPP' },
          value: '2400',
          priority: 'MEDIUM',
          ai_score: 72,
          assigned_to: { clerk_user_id: 'user_demo1', name: 'لينا' },
          latest_message_preview: 'تم التحويل، متى يوصل؟',
          last_customer_message_at: '2026-04-09T12:00:00Z',
          has_unread_alert: false,
        },
        {
          id: 10,
          title: 'حصة — ملابس أطفال موسمية',
          contact: { id: 10, name: 'حصة المطيري', platform: 'INSTAGRAM' },
          value: '950',
          priority: 'LOW',
          ai_score: 45,
          assigned_to: { clerk_user_id: 'user_demo2', name: 'محمد' },
          latest_message_preview: 'واتسب لما يجهز',
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
          title: 'بدر — ساعة فاخرة',
          contact: { id: 11, name: 'بدر الحربي', platform: 'WHATSAPP' },
          value: '15000',
          priority: 'HIGH',
          ai_score: 95,
          assigned_to: { clerk_user_id: 'user_demo1', name: 'لينا' },
          latest_message_preview: 'وصلت الساعة، شكراً جزيلاً!',
          last_customer_message_at: '2026-04-07T09:00:00Z',
          has_unread_alert: false,
        },
        {
          id: 12,
          title: 'أحمد — طلب عطور شركة',
          contact: { id: 12, name: 'أحمد المنصوري', platform: 'FACEBOOK' },
          value: '9800',
          priority: 'MEDIUM',
          ai_score: 80,
          assigned_to: { clerk_user_id: 'user_demo2', name: 'محمد' },
          latest_message_preview: 'الفاتورة مطلوبة للمحاسبة',
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
          title: 'عمر — استفسار أسعار جملة',
          contact: { id: 13, name: 'عمر الغامدي', platform: 'WHATSAPP' },
          value: '3000',
          priority: 'LOW',
          ai_score: 30,
          assigned_to: { clerk_user_id: 'user_demo1', name: 'لينا' },
          latest_message_preview: 'لقيت سعر أرخص عند غيركم',
          last_customer_message_at: '2026-04-05T14:00:00Z',
          has_unread_alert: false,
        },
        {
          id: 14,
          title: 'وليد — طلب تصميم خاص',
          contact: { id: 14, name: 'وليد الحمدان', platform: 'INSTAGRAM' },
          value: '1000',
          priority: 'LOW',
          ai_score: 33,
          assigned_to: { clerk_user_id: 'user_demo2', name: 'محمد' },
          latest_message_preview: 'ما عاد محتاج، شكراً',
          last_customer_message_at: '2026-04-04T16:00:00Z',
          has_unread_alert: false,
        },
      ],
    },
  ],
}
