import { useMutation } from "@tanstack/react-query"

import { useQuery } from "@tanstack/react-query"

import { useQueryClient } from "@tanstack/react-query"

import { DashboardLayout } from "../layouts/DashboardLayout"

import { FraudSignalList } from "../components/transactions/FraudSignalList"
import { RiskScore } from "../components/transactions/RiskScore"
import { StatusBadge } from "../components/transactions/StatusBadge"
import { PageHeader } from "../components/ui/PageHeader"
import {
  getReviewQueue,
  reviewTransaction,
} from "../services/review-service"
import { formatCurrency } from "../utils/formatters"


export function ReviewQueuePage() {
  const queryClient = useQueryClient()

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "review-queue",
    ],

    queryFn: getReviewQueue,
  })

  const mutation = useMutation({
    mutationFn: ({
      transactionId,
      status,
    }: {
      transactionId: string

      status:
        | "APPROVED"
        | "REJECTED"
    }) =>
      reviewTransaction(
        transactionId,
        status,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "review-queue",
        ],
      })
    },
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

  if (isError) {
    return (
      <DashboardLayout>
        <div className="alert alert-error">
          <span>
            Failed to load review queue.
          </span>
        </div>
      </DashboardLayout>
    )
  }
  return (
    <DashboardLayout>
      <div className="mb-6">
        <PageHeader
          title="Review Queue"
          description="Suspicious transactions awaiting analyst decision"
        />
      </div>

      <div className="space-y-4">
        {data?.map(
          (transaction) => (
            <div
              key={transaction.id}
              className="card bg-base-100 shadow-lg"
            >
              <div className="card-body">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <RiskScore
                        score={transaction.risk_score}
                      />

                      <StatusBadge
                        status={transaction.status}
                      />
                    </div>

                    <h2 className="text-2xl font-bold">
                      {formatCurrency(
                        transaction.amount,
                      )}
                    </h2>

                    <p>
                      <strong>IP:</strong>
                      {" "}
                      {transaction.ip_address}
                    </p>

                    <p>
                      <strong>Device:</strong>
                      {" "}
                      {transaction.device_id}
                    </p>

                    <FraudSignalList
                      signals={transaction.fraud_signals}
                      maxVisible={6}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        mutation.mutate({
                          transactionId:
                            transaction.id,

                          status:
                            "APPROVED",
                        })
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-error"
                      onClick={() =>
                        mutation.mutate({
                          transactionId:
                            transaction.id,

                          status:
                            "REJECTED",
                        })
                      }
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </DashboardLayout>
  )
}
