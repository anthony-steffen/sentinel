import type { ReactNode } from "react"


interface PageHeaderProps {
  title: string

  description: string

  actions?: ReactNode
}


export function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-3xl font-bold">
          {title}
        </h1>

        <p className="text-base-content/60 mt-1">
          {description}
        </p>
      </div>

      {actions ? (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
