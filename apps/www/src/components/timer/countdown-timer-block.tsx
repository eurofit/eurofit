"use client"

import { cn } from "@eurofit/ui/lib/utils"
import { Clock } from "lucide-react"
import { useTimer } from "react-timer-hook"

const pad = (value: number) => value.toString().padStart(2, "0")

type CountdownTimerBlockProps = {
  endDate: string
  autoStart?: boolean
  interval?: number
  onExpire?: () => void
  className?: string
}

export function CountdownTimerBlock({
  endDate,
  autoStart,
  interval,
  onExpire,
  className,
}: CountdownTimerBlockProps) {
  const { days, hours, minutes, seconds, isRunning } = useTimer({
    expiryTimestamp: new Date(endDate),
    autoStart,
    interval,
    onExpire,
  })

  if (!isRunning) return null

  const segments = [
    { label: "Days", value: days },
    { label: "Hrs", value: hours },
    { label: "Min", value: minutes },
    { label: "Sec", value: seconds },
  ]

  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      role="timer"
      aria-label={`Offer ends in ${days} days ${hours} hours ${minutes} minutes`}
    >
      <span className="flex items-center gap-1.5 text-sm font-medium text-destructive">
        <Clock className="size-4" aria-hidden="true" />
        Offer ends in
      </span>
      <div className="flex items-center gap-2">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="flex min-w-12 flex-col items-center rounded-md border bg-destructive px-2.5 py-1.5 text-white"
          >
            <span className="text-lg font-bold tabular-nums">
              {pad(segment.value)}
            </span>
            <span className="text-[10px] font-medium tracking-wide uppercase">
              {segment.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
