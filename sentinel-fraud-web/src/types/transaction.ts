export type TransactionStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "REVIEW"


export interface Transaction {
  id: string

  user_id: string

  amount: string

  ip_address: string

  device_id: string

  risk_score: number

  status: TransactionStatus

  fraud_signals: string[]

  created_at: string

  updated_at: string
}


export interface AnalyticsEntity {
  value: string

  count: number
}


export interface AnalyticsStatus {
  status: TransactionStatus

  count: number

  percentage: number
}


export interface AnalyticsRiskBucket {
  label: string

  min_score: number

  max_score: number

  count: number

  percentage: number
}


export interface AnalyticsSignal {
  signal: string

  count: number
}


export interface AnalyticsDailyVolume {
  date: string

  count: number

  total_amount: number
}


export interface TransactionAnalytics {
  total_transactions: number

  total_amount: number

  average_risk_score: number

  approved_transactions: number

  rejected_transactions: number

  review_transactions: number

  fraud_rate: number

  review_rate: number

  approval_rate: number

  top_ips: AnalyticsEntity[]

  top_devices: AnalyticsEntity[]

  status_distribution: AnalyticsStatus[]

  risk_buckets: AnalyticsRiskBucket[]

  top_signals: AnalyticsSignal[]

  daily_volume: AnalyticsDailyVolume[]
}
