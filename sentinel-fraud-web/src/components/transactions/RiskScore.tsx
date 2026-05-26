interface RiskScoreProps {
  score: number

  compact?: boolean
}


function getRiskClassName(
  score: number,
) {
  if (score >= 80) {
    return {
      text: "text-error",
      progress: "progress-error",
    }
  }

  if (score >= 30) {
    return {
      text: "text-warning",
      progress: "progress-warning",
    }
  }

  return {
    text: "text-success",
    progress: "progress-success",
  }
}


export function RiskScore({
  score,
  compact = false,
}: RiskScoreProps) {
  const className = getRiskClassName(
    score,
  )

  return (
    <div className="flex min-w-32 items-center gap-3">
      <span
        className={`w-10 text-right text-sm font-bold ${className.text}`}
      >
        {Math.round(score)}
      </span>

      {!compact ? (
        <progress
          className={`progress h-2 w-24 ${className.progress}`}
          value={score}
          max="100"
        />
      ) : null}
    </div>
  )
}
