import { useQuery } from "@tanstack/react-query"

import { DashboardLayout } from "../layouts/DashboardLayout"

import { getTransactions } from "../services/transaction-service"


export function TransactionsPage() {
  const {
    data,
    isLoading,
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
                          className={`badge-sm badge ${
                            transaction.risk_score >= 80
                              ? "badge-error"
                              : transaction.risk_score >= 30
                                ? "badge-warning"
                                : "badge-success"
                          }`}
                        >
                          {transaction.risk_score}
                        </div>
                      </td>

                      <td>
                        <div
                          className={`badge-sm badge ${
                            transaction.status ===
                            "APPROVED"
                              ? "badge-success"
                              : transaction.status ===
                                  "REJECTED"
                                ? "badge-error"
                                : "badge-warning"
                          }`}
                        >
                          {transaction.status}
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
                                className="badge badge-outline badge-error"
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