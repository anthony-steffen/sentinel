export type NotificationSeverity =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "CRITICAL"


export type NotificationType =
  | "TRANSACTION_REVIEW"
  | "HIGH_RISK_TRANSACTION"
  | "TRANSACTION_REJECTED"
  | "TRANSACTION_STATUS_UPDATED"
  | "BLACKLIST_TRIGGERED"
  | "SECURITY_ALERT"
  | "USER_BLOCKED"


export interface RealtimeNotification {
  id: string

  type: NotificationType

  severity: NotificationSeverity

  title: string

  message: string

  created_at: string

  metadata: Record<
    string,
    unknown
  >
}
