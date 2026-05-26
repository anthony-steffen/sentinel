import { formatEnumLabel } from "../../utils/formatters"


interface FraudSignalListProps {
  signals: string[]

  maxVisible?: number
}


export function FraudSignalList({
  signals,
  maxVisible = 3,
}: FraudSignalListProps) {
  if (signals.length === 0) {
    return (
      <span className="text-sm text-base-content/50">
        No signals
      </span>
    )
  }

  const visibleSignals = signals.slice(
    0,
    maxVisible,
  )

  const hiddenCount =
    signals.length - visibleSignals.length

  return (
    <div className="flex flex-wrap gap-2">
      {visibleSignals.map((signal) => (
        <span
          key={signal}
          className="badge badge-outline badge-error whitespace-nowrap"
        >
          {formatEnumLabel(signal)}
        </span>
      ))}

      {hiddenCount > 0 ? (
        <span className="badge badge-ghost">
          +{hiddenCount}
        </span>
      ) : null}
    </div>
  )
}
