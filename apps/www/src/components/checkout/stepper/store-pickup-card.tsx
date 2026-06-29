"use client"

import { STORE } from "@/const/store"
import { Clock, MapPin } from "lucide-react"

export function StorePickupCard() {
  return (
    <div className="space-y-4 rounded-md border bg-muted/50 p-4">
      <div className="flex items-center gap-1.5">
        <MapPin className="size-4 text-muted-foreground" aria-hidden />
        <h3 className="text-base font-medium text-foreground">Store Pickup</h3>
      </div>
      <div className="space-y-2">
        <p className="font-semibold">{STORE.name}</p>
        <div className="text-sm text-muted-foreground">
          {STORE.addressLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-4" aria-hidden />
          {STORE.hours}
        </p>
      </div>
    </div>
  )
}
