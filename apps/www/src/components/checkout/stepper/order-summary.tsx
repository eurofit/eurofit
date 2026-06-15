"use client"

import { DELIVERY_FEE } from "@/const/delivery"
import { formatWithCommas } from "@/lib/utils/format-with-commas"
import { Separator } from "@eurofit/ui/components/separator"

type OrderSummaryProps = {
  total: number
}

export function OrderSummary({ total }: OrderSummaryProps) {
  return (
    <div className="space-y-6 rounded-md bg-muted/50 p-2">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        Order Summary
      </h3>

      <dl>
        <div className="flex items-start justify-between gap-2 py-2">
          <dt className="font-medium">Subtotal</dt>
          <dd className="text-right slashed-zero tabular-nums">
            <span className="text-muted-foreground">Ksh</span>
            &nbsp;
            <span>{formatWithCommas(total)}</span>
          </dd>
        </div>
        <div className="flex items-start justify-between gap-2 py-2">
          <dt className="font-medium">Delivery Fee</dt>
          <dd className="text-right slashed-zero tabular-nums">
            <span className="text-muted-foreground">Ksh</span>
            &nbsp;
            <span>{formatWithCommas(DELIVERY_FEE)}</span>
          </dd>
        </div>
        <Separator className="my-2" />
        <div className="flex items-start justify-between gap-2 py-2 text-lg font-medium">
          <dt className="uppercase">Total</dt>
          <dd className="text-right slashed-zero tabular-nums">
            <span className="text-muted-foreground">Ksh</span>
            &nbsp;
            <span>{formatWithCommas(total + DELIVERY_FEE)}</span>
          </dd>
        </div>
      </dl>
    </div>
  )
}
