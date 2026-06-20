"use client"

import { DELIVERY_FEE } from "@/const/delivery"
import { formatWithCommas } from "@/lib/utils/format-with-commas"
import { Separator } from "@eurofit/ui/components/separator"

type OrderSummaryProps = {
  /** Pre-discount sum of all line items (KES). */
  subtotal: number
  /** Total savings from active discounts (KES). */
  discountTotal: number
}

type SummaryRowProps = {
  label: string
  amount: number
  /** Render a leading minus sign and accent color (for discounts). */
  isDeduction?: boolean
}

function SummaryRow({ label, amount, isDeduction }: SummaryRowProps) {
  return (
    <div className="flex items-start justify-between gap-2 py-2">
      <dt className="font-medium">{label}</dt>
      <dd className="text-right slashed-zero tabular-nums">
        <span className="text-muted-foreground">
          {isDeduction ? "−" : ""}Ksh
        </span>
        &nbsp;
        <span className={isDeduction ? "text-primary" : undefined}>
          {formatWithCommas(amount)}
        </span>
      </dd>
    </div>
  )
}

export function OrderSummary({ subtotal, discountTotal }: OrderSummaryProps) {
  const hasDiscount = discountTotal > 0
  const total = subtotal - discountTotal + DELIVERY_FEE

  return (
    <div className="space-y-6 rounded-md bg-muted/50 p-2">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        Order Summary
      </h3>

      <dl>
        <SummaryRow label="Subtotal" amount={subtotal} />
        {hasDiscount && (
          <SummaryRow label="Discount" amount={discountTotal} isDeduction />
        )}
        <SummaryRow label="Delivery Fee" amount={DELIVERY_FEE} />
        <Separator className="my-2" />
        <div className="flex items-start justify-between gap-2 py-2 text-lg font-medium">
          <dt className="uppercase">Total</dt>
          <dd className="text-right slashed-zero tabular-nums">
            <span className="text-muted-foreground">Ksh</span>
            &nbsp;
            <span>{formatWithCommas(total)}</span>
          </dd>
        </div>
      </dl>
    </div>
  )
}
