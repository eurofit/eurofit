import { formatWithCommas } from "@/lib/utils/format-with-commas"
import type { VariantDiscount } from "@/types/product-variant"
import { Badge } from "@eurofit/ui/components/badge"
import { cn } from "@eurofit/ui/lib/utils"

type VariantPriceProps = {
  /** Original retail price (KES). */
  price: number
  /** Active discount, when one applies. */
  discount: VariantDiscount | null
  /** `sm` for the list card, `lg` for the detail page. */
  size?: "sm" | "lg"
  className?: string
}

function savingsLabel(discount: VariantDiscount): string {
  return discount.type === "percentage"
    ? `-${discount.amount}%`
    : `Save Ksh ${formatWithCommas(discount.amount)}`
}

/**
 * Price block for a variant. When a discount applies it leads with the discounted
 * price, shows the original struck-through and muted, and a savings badge — otherwise
 * it renders the single retail price. `tabular-nums` keeps figures from shifting.
 */
export function VariantPrice({
  price,
  discount,
  size = "sm",
  className,
}: VariantPriceProps) {
  const priceClass = size === "lg" ? "text-3xl font-bold" : "text-lg font-bold"
  const originalClass = size === "lg" ? "text-base" : "text-xs"

  if (!discount) {
    return (
      <span
        className={cn(priceClass, "text-foreground tabular-nums", className)}
      >
        <span className="font-medium text-muted-foreground">Ksh </span>
        {formatWithCommas(price)}
      </span>
    )
  }

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className={cn(priceClass, "text-foreground tabular-nums")}>
          <span className="font-medium text-muted-foreground">Ksh </span>
          {formatWithCommas(discount.price)}
        </span>
        <Badge variant="destructive" className="font-semibold">
          {savingsLabel(discount)}
        </Badge>
      </div>
      <span
        className={cn(
          originalClass,
          "text-muted-foreground tabular-nums line-through"
        )}
      >
        Ksh {formatWithCommas(price)}
      </span>
    </div>
  )
}
