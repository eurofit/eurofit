"use client"

import { useEffect, useState } from "react"
import { useTimer } from "react-timer-hook"

const pad = (n: number) => n.toString().padStart(2, "0")

type ProductListTimerProps = {
  timer: string
}

export function ProductListTimer({ timer }: ProductListTimerProps) {
  const [isMounted, setIsMounted] = useState(false)

  const { days, hours, minutes, seconds, isRunning } = useTimer({
    expiryTimestamp: new Date(timer),
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !isRunning) return null

  const timeString =
    days > 0
      ? `${days}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`
      : `${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`

  return (
    <div className="tracking-tight">
      <span>Time Left: </span>
      <span className="font-bold tabular-nums">{timeString}</span>
    </div>
  )
}
