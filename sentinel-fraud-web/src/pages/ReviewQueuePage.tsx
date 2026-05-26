import { useMutation } from "@tanstack/react-query"

import { useQuery } from "@tanstack/react-query"

import { useQueryClient } from "@tanstack/react-query"

import { DashboardLayout } from "../layouts/DashboardLayout"

import {
  getReviewQueue,
  reviewTransaction,
} from "../services/review-service"


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
        <h1 className="text-3xl font-bold">
          Review Queue
        </h1>

        <p className="text-base-content/60 mt-1">
          Analyze suspicious transactions
        </p>
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
                      <div className="badge badge-error">
                        Risk Score:
                        {" "}
                        {transaction.risk_score}
                      </div>

                      <div className="badge badge-warning">
                        {transaction.status}
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold">
                      $
                      {Number(
                        transaction.amount,
                      ).toFixed(2)}
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

                    <div className="flex flex-wrap gap-2 pt-2">
                      {transaction.fraud_signals.map(
                        (signal) => (
                          <div
                            key={signal}
                            className="badge badge-outline"
                          >
                            {signal}
                          </div>
                        ),
                      )}
                    </div>
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