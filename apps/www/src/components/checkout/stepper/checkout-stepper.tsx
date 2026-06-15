"use client"

import * as React from "react"
import { Stepper } from "./steps"

export function CheckoutStepper(
  props: React.ComponentProps<typeof Stepper.Root>
) {
  return <Stepper.Root {...props} />
}
