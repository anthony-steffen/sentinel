export interface AuditLog {
  id: string

  user_id: string | null

  action: string

  ip_address: string

  created_at: string
}