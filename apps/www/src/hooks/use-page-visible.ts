"use client"

import { useEffect, useState } from "react"

export function usePageVisible() {
  const [isPageVisible, setIsPageVisible] = useState(
    typeof document !== "undefined" ? !document.hidden : true
  )

  useEffect(() => {
    const handleVisibilityChange = () => setIsPageVisible(!document.hidden)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  return isPageVisible
}
