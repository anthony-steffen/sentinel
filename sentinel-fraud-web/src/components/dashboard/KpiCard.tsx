interface KpiCardProps {
  title: string

  value: string | number

  valueClassName?: string
}


export function KpiCard({
  title,
  value,
  valueClassName = "",
}: KpiCardProps) {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <p className="text-base-content/70">
          {title}
        </p>

        <h2
          className={`text-4xl font-bold ${valueClassName}`}
        >
          {value}
        </h2>
      </div>
    </div>
  )
}