interface HorizontalBarDatum {
  label: string

  value: number

  helper?: string

  barClassName?: string
}


interface HorizontalBarChartProps {
  data: HorizontalBarDatum[]

  emptyLabel: string
}


export function HorizontalBarChart({
  data,
  emptyLabel,
}: HorizontalBarChartProps) {
  const maxValue = Math.max(
    ...data.map(
      (item) => item.value,
    ),
    1,
  )

  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-base-content/50">
        {emptyLabel}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div
          key={item.label}
          className="space-y-2"
        >
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="truncate font-medium">
              {item.label}
            </span>

            <span className="shrink-0 text-base-content/60">
              {item.helper || item.value}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-base-300">
            <div
              className={`h-full rounded-full ${item.barClassName || "bg-primary"}`}
              style={{
                width: `${Math.max(
                  (item.value / maxValue) * 100,
                  4,
                )}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
