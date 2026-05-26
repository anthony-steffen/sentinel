interface TrendPoint {
  label: string

  value: number

  helper?: string
}


interface TrendChartProps {
  points: TrendPoint[]

  emptyLabel: string
}


export function TrendChart({
  points,
  emptyLabel,
}: TrendChartProps) {
  const maxValue = Math.max(
    ...points.map(
      (point) => point.value,
    ),
    1,
  )

  if (points.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-base-content/50">
        {emptyLabel}
      </p>
    )
  }

  const coordinates = points.map(
    (point, index) => {
      const x =
        points.length === 1
          ? 50
          : (index / (points.length - 1)) * 100

      const y =
        44 - (point.value / maxValue) * 36

      return {
        x,
        y,
        point,
      }
    },
  )

  return (
    <div className="space-y-4">
      <svg
        viewBox="0 0 100 48"
        className="h-40 w-full overflow-visible text-primary"
        role="img"
        aria-label="Transaction volume trend"
        preserveAspectRatio="none"
      >
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          points={coordinates
            .map(
              (coordinate) =>
                `${coordinate.x},${coordinate.y}`,
            )
            .join(" ")}
        />

        {coordinates.map((coordinate) => (
          <circle
            key={coordinate.point.label}
            cx={coordinate.x}
            cy={coordinate.y}
            r="2.4"
            fill="currentColor"
          />
        ))}
      </svg>

      <div className="grid grid-cols-7 gap-2 text-center text-xs text-base-content/60">
        {points.map((point) => (
          <div
            key={point.label}
            className="min-w-0"
          >
            <p className="truncate">
              {point.label}
            </p>

            <p className="font-semibold text-base-content">
              {point.value}
            </p>

            {point.helper ? (
              <p className="truncate">
                {point.helper}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
