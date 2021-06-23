export const noop = () => {}
export const dollars = (value, decimalPlaces = 2) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: decimalPlaces,
    minimumFractionDigits: decimalPlaces,
  }).format(value)
