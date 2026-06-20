"use client"

import { cn } from "@eurofit/ui/lib/utils"
import { Clock } from "lucide-react"
import * as React from "react"

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

function getTimeLeft(endDate: string): TimeLeft {
  const total = new Date(endDate).getTime() - Date.now()
  const clamped = Math.max(0, total)

  return {
    total: clamped,
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
  }
}

const pad = (value: number) => value.toString().padStart(2, "0")

type CountdownTimerProps = {
  /** ISO end date for the discount. */
  endDate: string
  /** `inline` for the compact list card, `boxed` for the detail page. */
  variant?: "inline" | "boxed"
  /** Called once when the countdown reaches zero. */
  onExpire?: () => void
  className?: string
}

/**
 * Live countdown to a discount's end date. Renders nothing once expired. Reserves a
 * stable width via `tabular-nums` so the ticking value never shifts layout, and pairs
 * the urgency color with an icon + label so meaning is never conveyed by color alone.
 */
export function CountdownTimer({
  endDate,
  variant = "inline",
  onExpire,
  className,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft | null>(null)
  const onExpireRef = React.useRef(onExpire)

  React.useEffect(() => {
    onExpireRef.current = onExpire
  })

  React.useEffect(() => {
    setTimeLeft(getTimeLeft(endDate))

    const interval = setInterval(() => {
      const next = getTimeLeft(endDate)
      setTimeLeft(next)

      if (next.total <= 0) {
        clearInterval(interval)
        onExpireRef.current?.()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [endDate])

  // Before mount (and once expired) render nothing — avoids SSR/CSR hydration drift.
  if (!timeLeft || timeLeft.total <= 0) return null

  const { days, hours, minutes, seconds } = timeLeft

  if (variant === "boxed") {
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
              className="flex min-w-12 flex-col items-center rounded-md border bg-destructive px-2.5 py-1.5"
            >
              <span className="text-lg font-bold text-foreground tabular-nums">
                {pad(segment.value)}
              </span>
              <span className="text-[10px] font-medium tracking-wide text-white uppercase">
                {segment.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

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
