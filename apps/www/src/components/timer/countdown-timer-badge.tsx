"use client"

import { cn } from "@eurofit/ui/lib/utils"
import { Clock } from "lucide-react"
import { useTimer } from "react-timer-hook"

const pad = (value: number) => value.toString().padStart(2, "0")

type CountdownTimerBadgeProps = {
  endDate: string
  autoStart?: boolean
  interval?: number
  onExpire?: () => void
  className?: string
}

export function CountdownTimerBadge({
  endDate,
  autoStart,
  interval,
  onExpire,
  className,
}: CountdownTimerBadgeProps) {
  const { days, hours, minutes, seconds, isRunning } = useTimer({
    expiryTimestamp: new Date(endDate),
    autoStart,
    interval,
    onExpire,
  })

  if (!isRunning) return null

  const compact =
    days > 0
      ? `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive",
        className
      )}
      role="timer"
      aria-label={`Offer ends in ${compact}`}
    >
      <Clock className="size-3.5" aria-hidden="true" />
      <span>Ends in</span>
      <span className="tabular-nums">{compact}</span>
    </span>
  )
}
