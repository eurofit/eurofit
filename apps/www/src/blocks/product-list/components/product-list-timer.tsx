"use client"

import { Countdown } from "@/components/timer/countdown"
import { isFuture } from "date-fns"

type ProductListTimerProps = {
  timer: string
}

export function ProductListTimer({ timer }: ProductListTimerProps) {
  if (!isFuture(timer)) return null
  return (
    <div className="mx-auto tracking-tight">
      <span className="capitalize">Time left</span>
      &nbsp;
      <Countdown endDate={timer} />
    </div>
  )
}
