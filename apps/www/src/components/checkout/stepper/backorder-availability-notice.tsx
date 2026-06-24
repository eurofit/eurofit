"use client"

import { getDeliveryDateRange } from "@/lib/api/orders/get-delivery-date-range"
import { formatDeliveryDateRange } from "@/lib/utils/orders/format-delivery-date-range"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@eurofit/ui/components/alert"
import { RadioGroup, RadioGroupItem } from "@eurofit/ui/components/radio-group"
import { Skeleton } from "@eurofit/ui/components/skeleton"
import { useQuery } from "@tanstack/react-query"
import { CalendarClock } from "lucide-react"

type BackorderAvailabilityNoticeProps = {
  city: string
  startDate?: string
  hasInStockItems: boolean
  shipTogether: boolean
  onShipTogetherChange: (value: boolean) => void
}

export function BackorderAvailabilityNotice({
  city,
  startDate,
  hasInStockItems,
  shipTogether,
  onShipTogetherChange,
}: BackorderAvailabilityNoticeProps) {
  const { data: range, isPending } = useQuery({
    queryKey: ["delivery-date-range", city, startDate],
    queryFn: () => getDeliveryDateRange(city, startDate),
  })

  if (isPending) return <Skeleton className="h-24 w-full rounded-lg" />

  const formattedRange = range
    ? formatDeliveryDateRange(new Date(range.min), new Date(range.max))
    : null

  if (!hasInStockItems) {
    return <BackorderOnlyAlert formattedRange={formattedRange} />
  }

  return (
    <MixedCartShippingOptions
      formattedRange={formattedRange}
      shipTogether={shipTogether}
      onShipTogetherChange={onShipTogetherChange}
    />
  )
}

function BackorderOnlyAlert({
  formattedRange,
}: {
  formattedRange: string | null
}) {
  return (
    <Alert className="border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
      <CalendarClock className="size-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle>Estimated delivery</AlertTitle>
      <AlertDescription>
        {formattedRange ?? "To be confirmed"} — these items ship once stock
        arrives from our supplier.
      </AlertDescription>
    </Alert>
  )
}

type MixedCartShippingOptionsProps = {
  formattedRange: string | null
  shipTogether: boolean
  onShipTogetherChange: (value: boolean) => void
}

function MixedCartShippingOptions({
  formattedRange,
  shipTogether,
  onShipTogetherChange,
}: MixedCartShippingOptionsProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Shipping preference</p>
      <RadioGroup
        value={shipTogether ? "together" : "separate"}
        onValueChange={(v) => onShipTogetherChange(v === "together")}
        className="gap-2"
      >
        <ShippingOptionCard
          value="together"
          title="Ship everything together"
          description={
            formattedRange
              ? `We'll hold your order until all backorder items arrive. Estimated delivery: ${formattedRange}.`
              : "We'll hold your order until all backorder items arrive."
          }
        />
        <ShippingOptionCard
          value="separate"
          title="Ship available items now"
          description="In-stock items ship immediately. Backorder items ship separately when they arrive."
        />
      </RadioGroup>
    </div>
  )
}

type ShippingOptionCardProps = {
  value: string
  title: string
  description: string
}

function ShippingOptionCard({
  value,
  title,
  description,
}: ShippingOptionCardProps) {
  return (
    <label className="flex w-full cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50 has-aria-checked:border-primary has-aria-checked:bg-primary/5">
      <RadioGroupItem value={value} className="mt-0.5" />
      <div className="grid gap-1">
        <p className="text-sm leading-none font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </label>
  )
}
