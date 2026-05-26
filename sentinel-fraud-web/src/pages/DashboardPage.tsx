import { useQuery } from "@tanstack/react-query"

import {
  Activity,
  DollarSign,
  Gauge,
  ShieldAlert,
} from "lucide-react"

import { ChartPanel } from "../components/charts/ChartPanel"
import { DonutChart } from "../components/charts/DonutChart"
import { HorizontalBarChart } from "../components/charts/HorizontalBarChart"
import { TrendChart } from "../components/charts/TrendChart"
import { KpiCard } from "../components/dashboard/KpiCard"
import { KpiCardSkeleton } from "../components/skeletons/KpiCardSkeleton"
import { DashboardLayout } from "../layouts/DashboardLayout"
import { getDashboardSummary } from "../services/dashboard-service"
import { getTransactionAnalytics } from "../services/transaction-service"
import type { TransactionStatus } from "../types/transaction"
import {
  formatCurrency,
  formatEnumLabel,
  formatPercent,
  formatShortDate,
} from "../utils/formatters"


const statusColors: Record<
  TransactionStatus,
  {
    stroke: string

    dot: string
  }
> = {
  APPROVED: {
    stroke: "text-success",
    dot: "bg-success",
  },
  REJECTED: {
    stroke: "text-error",
    dot: "bg-error",
  },
  REVIEW: {
    stroke: "text-warning",
    dot: "bg-warning",
  },
  PENDING: {
    stroke: "text-neutral",
    dot: "bg-neutral",
  },
}


const riskBarColors: Record<string, string> = {
  Low: "bg-success",
  Medium: "bg-warning",
  High: "bg-error",
}


export function DashboardPage() {
  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useQuery({
    queryKey: [
      "dashboard-summary",
    ],

    queryFn: getDashboardSummary,
  })

  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
  } = useQuery({
    queryKey: [
      "transaction-analytics",
    ],

    queryFn: getTransactionAnalytics,
  })

  if (isSummaryLoading || isAnalyticsLoading) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="skeleton h-80 rounded-lg" />
          <div className="skeleton h-80 rounded-lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (isSummaryError || isAnalyticsError) {
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Transactions"
          icon={Activity}
          value={
            summary?.total_transactions || 0
          }
          helper="All processed activity"
        />

        <KpiCard
          title="Fraud Rate"
          icon={ShieldAlert}
          value={formatPercent(
            summary?.fraud_rate || 0,
          )}
          tone="error"
          helper={`${summary?.rejected_transactions || 0} rejected transactions`}
        />

        <KpiCard
          title="Average Risk"
          icon={Gauge}
          value={Math.round(
            summary?.average_risk_score || 0,
          )}
          tone="warning"
          helper="Weighted operational exposure"
        />

        <KpiCard
          title="Transaction Volume"
          icon={DollarSign}
          value={
            formatCurrency(
              analytics?.total_amount || 0,
            )
          }
          tone="success"
          helper="Total authorized amount"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartPanel
          title="Status Distribution"
          description="Operational split across approvals, reviews, rejections, and pending items"
        >
          <DonutChart
            centerLabel="transactions"
            centerValue={
              analytics?.total_transactions || 0
            }
            segments={
              analytics?.status_distribution.map(
                (status) => ({
                  label: formatEnumLabel(
                    status.status,
                  ),
                  value: status.count,
                  helper: formatPercent(
                    status.percentage,
                  ),
                  strokeClassName:
                    statusColors[status.status].stroke,
                  dotClassName:
                    statusColors[status.status].dot,
                }),
              ) || []
            }
          />
        </ChartPanel>

        <ChartPanel
          title="Daily Volume"
          description="Seven-day transaction count using the latest available activity window"
        >
          <TrendChart
            emptyLabel="No daily transaction volume yet."
            points={
              analytics?.daily_volume.map(
                (day) => ({
                  label: formatShortDate(
                    day.date,
                  ),
                  value: day.count,
                  helper: formatCurrency(
                    day.total_amount,
                  ),
                }),
              ) || []
            }
          />
        </ChartPanel>

        <ChartPanel
          title="Risk Buckets"
          description="Score distribution for low, medium, and high-risk traffic"
        >
          <HorizontalBarChart
            emptyLabel="No risk distribution yet."
            data={
              analytics?.risk_buckets.map(
                (bucket) => ({
                  label: `${bucket.label} (${bucket.min_score}-${bucket.max_score})`,
                  value: bucket.count,
                  helper: formatPercent(
                    bucket.percentage,
                  ),
                  barClassName:
                    riskBarColors[bucket.label]
                    || "bg-primary",
                }),
              ) || []
            }
          />
        </ChartPanel>

        <ChartPanel
          title="Top Fraud Signals"
          description="Most frequent signals currently shaping analyst workload"
        >
          <HorizontalBarChart
            emptyLabel="No fraud signals detected yet."
            data={
              analytics?.top_signals.map(
                (signal) => ({
                  label: formatEnumLabel(
                    signal.signal,
                  ),
                  value: signal.count,
                  barClassName: "bg-error",
                }),
              ) || []
            }
          />
        </ChartPanel>

        <ChartPanel
          title="Top IP Addresses"
          description="Sources with the highest transaction frequency"
        >
          <HorizontalBarChart
            emptyLabel="No IP concentration yet."
            data={
              analytics?.top_ips.map(
                (item) => ({
                  label: item.value,
                  value: item.count,
                  barClassName: "bg-info",
                }),
              ) || []
            }
          />
        </ChartPanel>

        <ChartPanel
          title="Top Devices"
          description="Device identifiers with repeated transaction activity"
        >
          <HorizontalBarChart
            emptyLabel="No device concentration yet."
            data={
              analytics?.top_devices.map(
                (item) => ({
                  label: item.value,
                  value: item.count,
                  barClassName: "bg-secondary",
                }),
              ) || []
            }
          />
        </ChartPanel>
      </div>
    </DashboardLayout>
  )
}
