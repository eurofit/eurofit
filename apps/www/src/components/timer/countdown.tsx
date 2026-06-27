"use client"

import { cn } from "@eurofit/ui/lib/utils"
import { useEffect, useState } from "react"
import { useTimer } from "react-timer-hook"

const pad = (value: number) => value.toString().padStart(2, "0")

type CountdownProps = {
  endDate: string
  autoStart?: boolean
  interval?: number
  onExpire?: () => void
  className?: string
}

export function Countdown({
  endDate,
  autoStart = true,
  interval,
  onExpire,
  className,
}: CountdownProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { days, hours, minutes, seconds, isRunning } = useTimer({
    expiryTimestamp: new Date(endDate),
    autoStart,
    interval,
    onExpire,
  })

  // Only produce the live time on the client to avoid a server/client
  // hydration mismatch on the constantly-changing time text.
  if (!isMounted || !isRunning) return null

  const compact =
    days > 0
      ? `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`

  return (
    <time
      dateTime={endDate}
      className={cn("inline-block font-bold tabular-nums", className)}
    >
      {compact}
    </time>
  )
}
