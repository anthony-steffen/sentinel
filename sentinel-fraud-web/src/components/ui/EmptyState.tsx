import type { LucideIcon } from "lucide-react"


interface EmptyStateProps {
  icon: LucideIcon

  title: string

  description: string
}


export function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-base-300 bg-base-100 p-8 text-center">
      <Icon
        size={32}
        className="text-base-content/40"
      />

      <div>
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        <p className="text-sm text-base-content/60">
          {description}
        </p>
      </div>
    </div>
  )
}
