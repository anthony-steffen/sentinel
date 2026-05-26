interface DonutSegment {
  label: string

  value: number

  helper?: string

  strokeClassName: string

  dotClassName: string
}


interface DonutChartProps {
  segments: DonutSegment[]

  centerLabel: string

  centerValue: string | number
}


export function DonutChart({
  segments,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const total = segments.reduce(
    (sum, segment) => sum + segment.value,
    0,
  )

  const radius = 38

  const circumference =
    2 * Math.PI * radius

  let offset = 0

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
      <div className="relative mx-auto h-52 w-52">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full -rotate-90"
          role="img"
          aria-label={centerLabel}
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            className="text-base-300"
          />

          {total > 0
            ? segments.map((segment) => {
              const dash =
                (segment.value / total)
                * circumference

              const circle = (
                <circle
                  key={segment.label}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={`${dash} ${circumference}`}
                  strokeDashoffset={-offset}
                  className={segment.strokeClassName}
                />
              )

              offset += dash

              return circle
            })
            : null}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold">
            {centerValue}
          </span>

          <span className="text-xs uppercase text-base-content/50">
            {centerLabel}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${segment.dotClassName}`}
              />

              <span className="text-sm font-medium">
                {segment.label}
              </span>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold">
                {segment.value}
              </p>

              {segment.helper ? (
                <p className="text-xs text-base-content/50">
                  {segment.helper}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
