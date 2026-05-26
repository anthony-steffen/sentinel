import { useQuery } from "@tanstack/react-query"

import { DashboardLayout } from "../layouts/DashboardLayout"

import { getTransactions } from "../services/transaction-service"


export function TransactionsPage() {
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Transactions
          </h1>

          <p className="text-base-content/60 mt-1">
            Monitor and analyze transaction activity
          </p>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th>IP Address</th>
                  <th>Device</th>
                  <th>Signals</th>
                </tr>
              </thead>

              <tbody>
                {data?.map(
                  (transaction) => (
                    <tr key={transaction.id}>
                      <td className="font-semibold">
                        $
                        {Number(
                          transaction.amount,
                        ).toFixed(2)}
                      </td>

                      <td>
                        <div
                          className={`text-sm text-center font-bold text ${
                            transaction.risk_score >= 80
                              ? "text-error"
                              : transaction.risk_score >= 30
                                ? "text-warning"
                                : "text-success"
                          }`}
                        >
                          {transaction.risk_score}
                        </div>
                      </td>

                      <td>
                        <div
                          className={`text-sm font-bold text-center text ${
                            transaction.status ===
                            "APPROVED"
                              ? "text-success"
                              : transaction.status ===
                                  "REJECTED"
                                ? "text-error"
                                : "text-warning"
                          }`}
                        >
                          {transaction.status.toLowerCase()}
                        </div>
                      </td>

                      <td>
                        {transaction.ip_address}
                      </td>

                      <td>
                        {transaction.device_id}
                      </td>

                      <td>
                        <div className="flex flex-wrap gap-2">
                          {transaction.fraud_signals.map(
                            (signal) => (
                              <div
                                key={signal}
                                className="text text-outline text-error"
                              >
                                {signal}
                              </div>
                            ),
                          )}
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}