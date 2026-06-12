"use client"

import { defineStepper, Get } from "@stepperize/react"

export const stepper = defineStepper([
  { id: "cart", title: "Cart" },
  { id: "address", title: "Address" },
  { id: "place-order", title: "Place Order" },
])

export const { Stepper, useStepper } = stepper

export type StepId = Get.Id<typeof stepper.steps>
export type StepData = Get.StepById<typeof stepper.steps, StepId>
