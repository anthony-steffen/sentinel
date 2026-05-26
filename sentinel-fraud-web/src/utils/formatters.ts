export function formatCurrency(
  value: number | string,
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    },
  ).format(
    Number(value) || 0,
  )
}


export function formatPercent(
  value: number,
) {
  return `${value.toFixed(1)}%`
}


export function formatDateTime(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(
    new Date(value),
  )
}


export function formatShortDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
    },
  ).format(
    new Date(`${value}T00:00:00`),
  )
}


export function formatEnumLabel(
  value: string,
) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase()
        + part.slice(1),
    )
    .join(" ")
}
