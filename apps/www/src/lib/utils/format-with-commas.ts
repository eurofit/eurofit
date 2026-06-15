type Options = Parameters<typeof Intl.NumberFormat>[1]

export function formatWithCommas(num: number, opts?: Options): string {
  return Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    ...opts,
  }).format(num)
}
