export interface Transaction {
  id: string

  amount: string

  ip_address: string

  device_id: string

  risk_score: number

  status: string

  fraud_signals: string[]

  created_at: string
}