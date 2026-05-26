import type { ReactNode } from "react"


interface ChartPanelProps {
  title: string

  description?: string

  children: ReactNode
}


export function ChartPanel({
  title,
  description,
  children,
}: ChartPanelProps) {
  return (
    <section className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body">
        <div>
          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          {description ? (
            <p className="text-sm text-base-content/60">
              {description}
            </p>
          ) : null}
        </div>

        {children}
      </div>
    </section>
  )
}
