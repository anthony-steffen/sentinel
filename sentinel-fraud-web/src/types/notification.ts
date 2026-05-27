export type NotificationSeverity =
  | "SUCCESS"
  | "WARNING"
  | "CRITICAL"


export type NotificationType =
  | "TRANSACTION_REVIEW"
  | "HIGH_RISK_TRANSACTION"
  | "TRANSACTION_REJECTED"
  | "TRANSACTION_STATUS_UPDATED"
  | "SECURITY_ALERT"


export interface RealtimeNotification {
  type: NotificationType

  severity: NotificationSeverity

  title: string

  message: string

  metadata: Record<
    string,
    unknown
  >
}