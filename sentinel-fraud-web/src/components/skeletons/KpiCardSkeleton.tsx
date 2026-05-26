export function KpiCardSkeleton() {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="skeleton h-4 w-32" />

        <div className="skeleton h-10 w-24 mt-4" />
      </div>
    </div>
  )
}