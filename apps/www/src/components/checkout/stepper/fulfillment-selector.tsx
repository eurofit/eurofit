"use client"

import { STORE } from "@/const/store"
import { Label } from "@eurofit/ui/components/label"
import { RadioGroup, RadioGroupItem } from "@eurofit/ui/components/radio-group"
import { Store, Truck } from "lucide-react"

export type FulfillmentMethod = "delivery" | "pickup"

type FulfillmentSelectorProps = {
  value: FulfillmentMethod
  onValueChange: (value: FulfillmentMethod) => void
}

type OptionProps = {
  value: FulfillmentMethod
  icon: React.ReactNode
  title: string
  description: string
}

function FulfillmentOption({ value, icon, title, description }: OptionProps) {
  return (
    <Label
      htmlFor={`fulfillment-${value}`}
      className="flex min-h-12 w-full grow cursor-pointer items-start gap-3 rounded-lg border p-4 font-normal transition-colors duration-200 hover:bg-accent/50 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50"
    >
      <RadioGroupItem
        id={`fulfillment-${value}`}
        value={value}
        className="mt-0.5"
      />
      <div className="grid gap-1">
        <span className="flex items-center gap-1.5 text-sm leading-none font-medium text-foreground">
          <span className="text-muted-foreground" aria-hidden>
            {icon}
          </span>
          {title}
        </span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </Label>
  )
}

export function FulfillmentSelector({
  value,
  onValueChange,
}: FulfillmentSelectorProps) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-medium text-foreground">
          How would you like to receive your order?
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Choose delivery or pick up at our store.
        </p>
      </div>
      <RadioGroup
        value={value}
        onValueChange={(next) => onValueChange(next as FulfillmentMethod)}
        className="grid gap-2 md:grid-cols-2"
      >
        <FulfillmentOption
          value="delivery"
          icon={<Truck className="size-4" />}
          title="Deliver to my address"
          description="Ksh 300 delivery fee"
        />
        <FulfillmentOption
          value="pickup"
          icon={<Store className="size-4" />}
          title="Pick up at our store"
          description={`Free — ${STORE.addressLines[0]}`}
        />
      </RadioGroup>
    </div>
  )
}
