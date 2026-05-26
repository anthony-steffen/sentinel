import { useQuery } from "@tanstack/react-query"

import { DashboardLayout } from "../layouts/DashboardLayout"

import { getAuditLogs } from "../services/audit-service"


export function AuditLogsPage() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "audit-logs",
    ],

    queryFn: getAuditLogs,
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
            Failed to load audit logs.
          </span>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Audit Logs
        </h1>

        <p className="text-base-content/60 mt-1">
          Security and operational activity history
        </p>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>User ID</th>
                  <th>IP Address</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {data?.map(
                  (log) => (
                    <tr key={log.id}>
                      <td>
                        <div className="badge badge-outline">
                          {log.action}
                        </div>
                      </td>

                      <td className="font-mono text-xs">
                        {log.user_id || "-"}
                      </td>

                      <td>
                        {log.ip_address}
                      </td>

                      <td>
                        {new Date(
                          log.created_at,
                        ).toLocaleString()}
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