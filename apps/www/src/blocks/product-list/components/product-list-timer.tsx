"use client"

import { useEffect, useState } from "react"
import { useTimer } from "react-timer-hook"

const pad = (n: number) => n.toString().padStart(2, "0")

type ProductListTimerProps = {
  timer: string
}

export function ProductListTimer({ timer }: ProductListTimerProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { days, hours, minutes, seconds, isRunning } = useTimer({
    expiryTimestamp: new Date(timer),
  })

  if (!isMounted || !isRunning) return null

  const timeString =
    days > 0
      ? `${days}d : ${pad(hours)}h : ${pad(minutes)}m`
      : `${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`

  return (
    <div className="text-center tracking-tight">
      <span>Time Left: </span>
      <span className="font-bold tabular-nums">{timeString}</span>
    </div>
  )
}
