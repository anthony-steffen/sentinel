import { useQuery } from "@tanstack/react-query"

import { DashboardLayout } from "../layouts/DashboardLayout"

import { getDashboardSummary } from "../services/dashboard-service"


export function DashboardPage() {
  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: [
      "dashboard-summary",
    ],

    queryFn: getDashboardSummary,
  })

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <p className="text-base-content/70">
              Total Transactions
            </p>

            <h2 className="text-4xl font-bold">
              {data?.total_transactions}
            </h2>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <p className="text-base-content/70">
              Fraud Rate
            </p>

            <h2 className="text-4xl font-bold text-error">
               {data?.fraud_rate.toFixed(1)}%
            </h2>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <p className="text-base-content/70">
              Approval Rate
            </p>

            <h2 className="text-4xl font-bold text-success">
                {data?.approval_rate.toFixed(1)}%
            </h2>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <p className="text-base-content/70">
              Review Queue
            </p>

            <h2 className="text-4xl font-bold text-warning">
             {data?.review_transactions}
            </h2>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}