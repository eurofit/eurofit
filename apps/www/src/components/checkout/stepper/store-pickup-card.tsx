"use client"

import { site } from "@/const/site"
import { MapPin } from "lucide-react"

export function StorePickupCard() {
  return (
    <div className="space-y-4 rounded-md border bg-muted/50 p-4">
      <div className="flex items-center gap-1.5">
        <MapPin className="size-4 text-muted-foreground" aria-hidden />
        <h3 className="text-base font-medium text-foreground">Store Pickup</h3>
      </div>
      <div className="space-y-2">
        <p className="font-semibold">{site.name}</p>
        <p className="text-sm text-muted-foreground">
          {site.address.fullAddress}
        </p>
      </div>
    </div>
  )
}
