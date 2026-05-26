import { X } from "lucide-react"

import type { Transaction } from "../../types/transaction"

import {
  formatCurrency,
  formatDateTime,
} from "../../utils/formatters"

import { FraudSignalList } from "./FraudSignalList"
import { RiskScore } from "./RiskScore"
import { StatusBadge } from "./StatusBadge"


interface TransactionDetailsDialogProps {
  transaction: Transaction | null

  onClose: () => void
}


function DetailItem({
  label,
  value,
}: {
  label: string

  value: string
}) {
  return (
    <div>
      <p className="text-xs uppercase text-base-content/50">
        {label}
      </p>

      <p className="mt-1 break-all font-medium">
        {value}
      </p>
    </div>
  )
}


export function TransactionDetailsDialog({
  transaction,
  onClose,
}: TransactionDetailsDialogProps) {
  if (!transaction) {
    return null
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-base-content/60">
              Transaction details
            </p>

            <h2 className="text-2xl font-bold">
              {formatCurrency(transaction.amount)}
            </h2>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-circle"
            onClick={onClose}
            title="Close transaction details"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-base-300 p-4">
            <p className="mb-3 text-xs uppercase text-base-content/50">
              Risk
            </p>

            <RiskScore score={transaction.risk_score} />
          </div>

          <div className="rounded-lg border border-base-300 p-4">
            <p className="mb-3 text-xs uppercase text-base-content/50">
              Status
            </p>

            <StatusBadge status={transaction.status} />
          </div>

          <div className="rounded-lg border border-base-300 p-4">
            <p className="mb-3 text-xs uppercase text-base-content/50">
              Signals
            </p>

            <FraudSignalList
              signals={transaction.fraud_signals}
              maxVisible={6}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <DetailItem
            label="Transaction ID"
            value={transaction.id}
          />

          <DetailItem
            label="User ID"
            value={transaction.user_id}
          />

          <DetailItem
            label="IP Address"
            value={transaction.ip_address}
          />

          <DetailItem
            label="Device"
            value={transaction.device_id}
          />

          <DetailItem
            label="Created"
            value={formatDateTime(
              transaction.created_at,
            )}
          />

          <DetailItem
            label="Updated"
            value={formatDateTime(
              transaction.updated_at,
            )}
          />
        </div>
      </div>

      <form
        method="dialog"
        className="modal-backdrop"
      >
        <button onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  )
}
