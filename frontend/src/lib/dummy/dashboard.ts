export interface UsageData {
  generations_used: number
  generations_limit: number
  plan_name: string
  plan_color: string
  monthly_spend: number
  monthly_cap: number
}

export interface PipelineStats {
  total_value: string
  currency: string
  by_source: { source: string; amount: string; percent: number }[]
  mom_change_percent: number | null
}

export interface ChannelStats {
  uptime_percent_30d: number | null
  messages_synced_30d: number
  active_channels: number
}

export const DUMMY_USAGE: UsageData = {
  generations_used: 12,
  generations_limit: 50,
  plan_name: 'Starter',
  plan_color: '#594FBF',
  monthly_spend: 4.20,
  monthly_cap: 10.00,
}

export const DUMMY_PIPELINE_STATS: PipelineStats = {
  total_value: '84200.00',
  currency: 'USD',
  by_source: [
    { source: 'shopify', amount: '56200.00', percent: 67 },
    { source: 'whatsapp', amount: '21000.00', percent: 25 },
    { source: 'manual', amount: '7000.00', percent: 8 },
  ],
  mom_change_percent: 12.4,
}

export const DUMMY_CHANNEL_STATS: ChannelStats = {
  uptime_percent_30d: null,
  messages_synced_30d: 1243,
  active_channels: 3,
}
