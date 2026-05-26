import { useQuery } from "@tanstack/react-query"

import { KpiCard } from "../components/dashboard/KpiCard"

import { KpiCardSkeleton } from "../components/skeletons/KpiCardSkeleton"

import { DashboardLayout } from "../layouts/DashboardLayout"

import { getDashboardSummary } from "../services/dashboard-service"


export function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "dashboard-summary",
    ],

    queryFn: getDashboardSummary,
  })

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>
      </DashboardLayout>
    )
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="alert alert-error">
          <span>
            Failed to load dashboard data.
          </span>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard
          title="Total Transactions"
          value={
            data?.total_transactions || 0
          }
        />

        <KpiCard
          title="Fraud Rate"
          value={`${data?.fraud_rate.toFixed(1)}%`}
          valueClassName="text-error"
        />

        <KpiCard
          title="Approval Rate"
          value={`${data?.approval_rate.toFixed(1)}%`}
          valueClassName="text-success"
        />

        <KpiCard
          title="Review Queue"
          value={
            data?.review_transactions || 0
          }
          valueClassName="text-warning"
        />
      </div>
    </DashboardLayout>
  )
}