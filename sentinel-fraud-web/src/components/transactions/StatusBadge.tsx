import type { TransactionStatus } from "../../types/transaction"

import { formatEnumLabel } from "../../utils/formatters"


const statusClasses: Record<TransactionStatus, string> = {
  APPROVED: "badge-success",
  REJECTED: "badge-error",
  REVIEW: "badge-warning",
  PENDING: "badge-neutral",
}


interface StatusBadgeProps {
  status: TransactionStatus
}


export function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <span
      className={`badge ${statusClasses[status]} whitespace-nowrap font-medium`}
    >
      {formatEnumLabel(status)}
    </span>
  )
}
