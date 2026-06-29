"use client"

import { formatWithCommas } from "@/lib/utils/format-with-commas"
import { Separator } from "@eurofit/ui/components/separator"

type OrderSummaryProps = {
  /** Pre-discount sum of all line items (KES). */
  subtotal: number
  /** Total savings from active discounts (KES). */
  discountTotal: number
  /** Delivery fee for this order (KES). Zero for store pickup. */
  deliveryFee: number
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
      <dt className="font-medium text-muted-foreground">{label}</dt>
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

export function OrderSummary({
  subtotal,
  discountTotal,
  deliveryFee,
}: OrderSummaryProps) {
  const hasDiscount = discountTotal > 0
  const isPickup = deliveryFee === 0
  const total = subtotal - discountTotal + deliveryFee

  return (
    <div className="space-y-4 rounded-md border bg-muted/50 p-4">
      <h3 className="text-base font-semibold tracking-tight text-foreground">
        Order Summary
      </h3>

      <dl>
        <SummaryRow label="Subtotal" amount={subtotal} />
        {hasDiscount && (
          <SummaryRow label="Discount" amount={discountTotal} isDeduction />
        )}
        {isPickup ? (
          <div className="flex items-start justify-between gap-2 py-2">
            <dt className="font-medium text-muted-foreground">Store pickup</dt>
            <dd className="text-right font-medium text-primary">Free</dd>
          </div>
        ) : (
          <SummaryRow label="Delivery Fee" amount={deliveryFee} />
        )}
        <Separator className="my-2" />
        <div className="-mx-2 flex items-center justify-between gap-2 rounded-md bg-muted/40 px-2 py-2 font-bold">
          <dt className="text-sm tracking-wide uppercase">Total</dt>
          <dd className="text-right slashed-zero tabular-nums">
            <span className="text-sm text-muted-foreground">Ksh</span>
            &nbsp;
            <span className="text-xl">{formatWithCommas(total)}</span>
          </dd>
        </div>
      </dl>
    </div>
  )
}
