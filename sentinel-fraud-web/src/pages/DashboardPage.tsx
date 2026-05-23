import { DashboardLayout } from "../layouts/DashboardLayout"


export function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <p className="text-base-content/70">
              Total Transactions
            </p>

            <h2 className="text-4xl font-bold">
              54
            </h2>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <p className="text-base-content/70">
              Fraud Rate
            </p>

            <h2 className="text-4xl font-bold text-error">
              16.6%
            </h2>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <p className="text-base-content/70">
              Approval Rate
            </p>

            <h2 className="text-4xl font-bold text-success">
              55.5%
            </h2>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <p className="text-base-content/70">
              Review Queue
            </p>

            <h2 className="text-4xl font-bold text-warning">
              15
            </h2>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}