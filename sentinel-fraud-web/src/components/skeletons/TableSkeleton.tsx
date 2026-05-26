interface TableSkeletonProps {
  rows?: number
}


export function TableSkeleton({
  rows = 6,
}: TableSkeletonProps) {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-0">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <div className="skeleton h-4 w-20" />
                </th>

                <th>
                  <div className="skeleton h-4 w-20" />
                </th>

                <th>
                  <div className="skeleton h-4 w-20" />
                </th>

                <th>
                  <div className="skeleton h-4 w-20" />
                </th>
              </tr>
            </thead>

            <tbody>
              {Array.from({
                length: rows,
              }).map((_, index) => (
                <tr key={index}>
                  <td>
                    <div className="skeleton h-4 w-24" />
                  </td>

                  <td>
                    <div className="skeleton h-4 w-20" />
                  </td>

                  <td>
                    <div className="skeleton h-4 w-28" />
                  </td>

                  <td>
                    <div className="skeleton h-4 w-16" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}