import {
  ArrowDownUp,
  Eye,
} from "lucide-react"

import { motion } from "framer-motion"

import type {
  Transaction,
  TransactionStatus,
} from "../../types/transaction"

import {
  formatCurrency,
  formatDateTime,
} from "../../utils/formatters"

import { FraudSignalList } from "./FraudSignalList"

import { RiskScore } from "./RiskScore"

import { StatusBadge } from "./StatusBadge"


export type TransactionSortKey =
  | "created_at"
  | "amount"
  | "risk_score"
  | "status"


interface TransactionsTableProps {
  transactions: Transaction[]

  sortKey: TransactionSortKey

  sortDirection: "asc" | "desc"

  onSort: (
    key: TransactionSortKey,
  ) => void

  onSelect: (
    transaction: Transaction,
  ) => void
}


const sortableColumns: Array<{
  key: TransactionSortKey

  label: string
}> = [
  {
    key: "created_at",
    label: "Date",
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "risk_score",
    label: "Risk",
  },
  {
    key: "status",
    label: "Status",
  },
]


function SortHeader({
  label,
  active,
  direction,
  onClick,
}: {
  label: string

  active: boolean

  direction: "asc" | "desc"

  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="btn btn-ghost btn-xs gap-1 px-1"
      onClick={onClick}
      title={`Sort by ${label}`}
    >
      {label}

      <ArrowDownUp
        size={14}
        className={
          active
            ? "opacity-100"
            : "opacity-40"
        }
      />

      {active ? (
        <span className="text-[10px] uppercase">
          {direction}
        </span>
      ) : null}
    </button>
  )
}


export function TransactionsTable({
  transactions,
  sortKey,
  sortDirection,
  onSort,
  onSelect,
}: TransactionsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            {sortableColumns.map(
              (column) => (
                <th key={column.key}>
                  <SortHeader
                    label={
                      column.label
                    }
                    active={
                      sortKey ===
                      column.key
                    }
                    direction={
                      sortDirection
                    }
                    onClick={() =>
                      onSort(
                        column.key,
                      )
                    }
                  />
                </th>
              ),
            )}

            <th>IP Address</th>

            <th>Device</th>

            <th>Signals</th>

            <th className="text-right">
              Details
            </th>
          </tr>
        </thead>

        <tbody>
          {transactions.map(
            (
              transaction,
            ) => (
              <motion.tr
                key={
                  transaction.id
                }
                initial={{
                  opacity: 0,
                  backgroundColor:
                    "rgba(16, 185, 129, 0.15)",
                }}
                animate={{
                  opacity: 1,
                  backgroundColor:
                    "rgba(0,0,0,0)",
                }}
                transition={{
                  duration: 1.2,
                }}
              >
                <td className="whitespace-nowrap">
                  {formatDateTime(
                    transaction.created_at,
                  )}
                </td>

                <td className="font-semibold">
                  {formatCurrency(
                    transaction.amount,
                  )}
                </td>

                <td>
                  <RiskScore
                    score={
                      transaction.risk_score
                    }
                  />
                </td>

                <td>
                  <StatusBadge
                    status={
                      transaction.status as TransactionStatus
                    }
                  />
                </td>

                <td className="font-mono text-xs">
                  {
                    transaction.ip_address
                  }
                </td>

                <td className="max-w-44 truncate font-mono text-xs">
                  {
                    transaction.device_id
                  }
                </td>

                <td>
                  <FraudSignalList
                    signals={
                      transaction.fraud_signals
                    }
                  />
                </td>

                <td className="text-right">
                  <button
                    type="button"
                    className="btn btn-ghost btn-circle btn-sm"
                    onClick={() =>
                      onSelect(
                        transaction,
                      )
                    }
                    title="Open transaction details"
                  >
                    <Eye
                      size={16}
                    />
                  </button>
                </td>
              </motion.tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  )
}