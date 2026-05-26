import {
  useMemo,
  useState,
} from "react"

import { useQuery } from "@tanstack/react-query"

import {
  Filter,
  Search,
} from "lucide-react"

import { TransactionDetailsDialog } from "../components/transactions/TransactionDetailsDialog"
import {
  TransactionsTable,
  type TransactionSortKey,
} from "../components/transactions/TransactionsTable"
import { EmptyState } from "../components/ui/EmptyState"
import { PageHeader } from "../components/ui/PageHeader"
import { DashboardLayout } from "../layouts/DashboardLayout"
import { getTransactions } from "../services/transaction-service"
import type {
  Transaction,
  TransactionStatus,
} from "../types/transaction"
import { formatEnumLabel } from "../utils/formatters"


type RiskFilter =
  | "all"
  | "low"
  | "medium"
  | "high"


function matchesRiskFilter(
  transaction: Transaction,
  filter: RiskFilter,
) {
  if (filter === "low") {
    return transaction.risk_score < 30
  }

  if (filter === "medium") {
    return (
      transaction.risk_score >= 30
      && transaction.risk_score < 80
    )
  }

  if (filter === "high") {
    return transaction.risk_score >= 80
  }

  return true
}


function getSortValue(
  transaction: Transaction,
  key: TransactionSortKey,
) {
  if (key === "amount") {
    return Number(transaction.amount)
  }

  if (key === "risk_score") {
    return transaction.risk_score
  }

  if (key === "created_at") {
    return new Date(
      transaction.created_at,
    ).getTime()
  }

  return transaction.status
}


export function TransactionsPage() {
  const [
    searchTerm,
    setSearchTerm,
  ] = useState("")

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<TransactionStatus | "all">("all")

  const [
    riskFilter,
    setRiskFilter,
  ] = useState<RiskFilter>("all")

  const [
    sortKey,
    setSortKey,
  ] = useState<TransactionSortKey>("created_at")

  const [
    sortDirection,
    setSortDirection,
  ] = useState<"asc" | "desc">("desc")

  const [
    selectedTransaction,
    setSelectedTransaction,
  ] = useState<Transaction | null>(null)

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "transactions",
    ],

    queryFn: getTransactions,
  })

  const transactions = useMemo(
    () => data || [],
    [
      data,
    ],
  )

  const filteredTransactions = useMemo(
    () => {
      const normalizedSearch =
        searchTerm.trim().toLowerCase()

      return transactions
        .filter((transaction) => {
          const matchesSearch =
            normalizedSearch.length === 0
            || [
              transaction.id,
              transaction.user_id,
              transaction.ip_address,
              transaction.device_id,
              transaction.status,
              ...transaction.fraud_signals,
            ]
              .join(" ")
              .toLowerCase()
              .includes(normalizedSearch)

          const matchesStatus =
            statusFilter === "all"
            || transaction.status === statusFilter

          return (
            matchesSearch
            && matchesStatus
            && matchesRiskFilter(
              transaction,
              riskFilter,
            )
          )
        })
        .sort((first, second) => {
          const firstValue = getSortValue(
            first,
            sortKey,
          )

          const secondValue = getSortValue(
            second,
            sortKey,
          )

          if (firstValue < secondValue) {
            return sortDirection === "asc"
              ? -1
              : 1
          }

          if (firstValue > secondValue) {
            return sortDirection === "asc"
              ? 1
              : -1
          }

          return 0
        })
    },
    [
      transactions,
      searchTerm,
      statusFilter,
      riskFilter,
      sortKey,
      sortDirection,
    ],
  )

  function handleSort(
    key: TransactionSortKey,
  ) {
    if (key === sortKey) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : "asc",
      )

      return
    }

    setSortKey(key)

    setSortDirection("desc")
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="alert alert-error">
          <span>
            Failed to load transactions.
          </span>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Transactions"
          description="Transaction ledger with risk, source, status, and signal context"
        />

        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body gap-4">
            <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_180px_180px]">
              <label className="input input-bordered flex items-center gap-2">
                <Search
                  size={18}
                  className="text-base-content/40"
                />

                <input
                  type="search"
                  className="grow"
                  placeholder="Search ID, IP, device, signal"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value,
                    )
                  }
                />
              </label>

              <div className="relative">
                <Filter
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                />

                <select
                  className="select select-bordered w-full pl-10"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as
                        | TransactionStatus
                        | "all",
                    )
                  }
                >
                  <option value="all">
                    All statuses
                  </option>

                  {[
                    "APPROVED",
                    "REJECTED",
                    "REVIEW",
                    "PENDING",
                  ].map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {formatEnumLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              <select
                className="select select-bordered"
                value={riskFilter}
                onChange={(event) =>
                  setRiskFilter(
                    event.target.value as RiskFilter,
                  )
                }
              >
                <option value="all">
                  All risk levels
                </option>

                <option value="low">
                  Low risk
                </option>

                <option value="medium">
                  Medium risk
                </option>

                <option value="high">
                  High risk
                </option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/60">
              <span className="font-medium text-base-content">
                {filteredTransactions.length}
              </span>

              <span>
                of
              </span>

              <span className="font-medium text-base-content">
                {transactions.length}
              </span>

              <span>
                transactions shown
              </span>
            </div>

            {filteredTransactions.length > 0 ? (
              <TransactionsTable
                transactions={filteredTransactions}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
                onSelect={setSelectedTransaction}
              />
            ) : (
              <EmptyState
                icon={Search}
                title="No transactions found"
                description="No records match the current operational view."
              />
            )}
          </div>
        </div>
      </div>

      <TransactionDetailsDialog
        transaction={selectedTransaction}
        onClose={() =>
          setSelectedTransaction(null)
        }
      />
    </DashboardLayout>
  )
}
