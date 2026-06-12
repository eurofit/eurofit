"use client"

import { Button } from "@eurofit/ui/components/button"
import { cn } from "@eurofit/ui/lib/utils"
import { CheckCircleIcon } from "lucide-react"
import * as React from "react"
import { Stepper, useStepper } from "./steps"

export function CheckoutStepperHeader({
  className,
  ...props
}: React.ComponentProps<typeof Stepper.List>) {
  const stepper = useStepper()

  return (
    <Stepper.List
      className={cn(
        "m-0 mx-auto flex max-w-md list-none flex-row items-center justify-between gap-2 p-0",
        className
      )}
      {...props}
    >
      <Stepper.Items>
        {(step, index) => {
          const status = stepper.status(step.id)
          const isLastStep = index === stepper.count - 1

          return (
            <Stepper.Item
              key={step.id}
              step={step.id}
              className="group peer relative flex w-full flex-col items-center justify-center gap-2"
            >
              <Stepper.Trigger
                render={(props) => (
                  <Button
                    className={cn(
                      "rounded-full data-[status=previous]:bg-green-50 data-[status=previous]:text-green-700 data-[status=previous]:hover:bg-green-50",
                      {
                        "ring-2 ring-primary ring-offset-2":
                          status === "active",
                      }
                    )}
                    variant={status === "upcoming" ? "outline" : "default"}
                    size="icon"
                    {...props}
                    disabled={status === "upcoming"}
                  >
                    <Stepper.Indicator>
                      {status === "previous" && <CheckCircleIcon />}
                      {status !== "previous" && index + 1}
                    </Stepper.Indicator>
                  </Button>
                )}
              />
              {!isLastStep && (
                <Stepper.Separator
                  orientation="horizontal"
                  data-status={status}
                  className="absolute top-5 right-[calc(-50%+20px)] left-[calc(50%+30px)] block h-0.5 shrink-0 bg-muted transition-all duration-300 ease-in-out data-[status=previous]:bg-green-500 data-disabled:opacity-50"
                />
              )}

              <div className="flex flex-col items-center gap-1 text-center">
                <Stepper.Title
                  render={(props) => (
                    <h4 className="text-sm font-medium" {...props}>
                      {step.title}
                    </h4>
                  )}
                />
              </div>
            </Stepper.Item>
          )
        }}
      </Stepper.Items>
    </Stepper.List>
  )
}
