import type { LucideIcon } from "lucide-react"


interface KpiCardProps {
  title: string

  value: string | number

  helper?: string

  icon?: LucideIcon

  tone?:
    | "neutral"
    | "success"
    | "warning"
    | "error"

  valueClassName?: string
}


const toneClasses = {
  neutral: {
    icon: "bg-base-200 text-base-content",
    value: "",
  },
  success: {
    icon: "bg-success/10 text-success",
    value: "text-success",
  },
  warning: {
    icon: "bg-warning/10 text-warning",
    value: "text-warning",
  },
  error: {
    icon: "bg-error/10 text-error",
    value: "text-error",
  },
}


export function KpiCard({
  title,
  value,
  helper,
  icon: Icon,
  tone = "neutral",
  valueClassName = "",
}: KpiCardProps) {
  const className = toneClasses[tone]

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body gap-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-base-content/70">
            {title}
          </p>

          {Icon ? (
            <div
              className={`rounded-lg p-2 ${className.icon}`}
            >
              <Icon size={18} />
            </div>
          ) : null}
        </div>

        <h2
          className={`text-4xl font-bold ${className.value} ${valueClassName}`}
        >
          {value}
        </h2>

        {helper ? (
          <p className="text-sm text-base-content/50">
            {helper}
          </p>
        ) : null}
      </div>
    </div>
  )
}
