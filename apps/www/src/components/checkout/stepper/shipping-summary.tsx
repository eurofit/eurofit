"use client"

import { Address } from "@/payload-types"
import { Button } from "@eurofit/ui/components/button"
import { ChevronRight, MapPin } from "lucide-react"

type ShippingSummaryProps = {
  address: Address | undefined
  onChange: () => void
}

export function ShippingSummary({ address, onChange }: ShippingSummaryProps) {
  return (
    <div className="space-y-4 rounded-md border bg-muted/50 p-4">
      <div className="flex items-center gap-2.5">
        <div>
          <div className="flex items-center gap-1.5">
            <MapPin className="size-4 text-muted-foreground" aria-hidden />
            <h3 className="text-base font-medium text-foreground">
              Shipping Address
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Where your order will be delivered
          </p>
        </div>
        <div className="ml-auto">
          <Button variant="ghost" size="xs" onClick={onChange}>
            Change <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <p className="font-semibold capitalize">
          {address?.title} {address?.firstName} {address?.lastName}
        </p>
        <div className="text-sm text-muted-foreground">
          <p>{address?.line1},</p>
          {address?.line2 && <p>{address?.line2},</p>}
          <p>
            {address?.area}, {address?.postalCode}
          </p>
          {address?.city && <p>{address?.city}</p>}
          {address?.county && <p>{address?.county}</p>}
          {address?.country && <p>{address?.country}</p>}
          {address?.phone && <p>{address?.phone}</p>}
        </div>
      </div>
    </div>
  )
}
