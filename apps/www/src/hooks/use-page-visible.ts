"use client"

import { useEffect, useState } from "react"

export function usePageVisible() {
  const [isPageVisible, setIsPageVisible] = useState(true)

  useEffect(() => {
    setIsPageVisible(!document.hidden)
    const handleVisibilityChange = () => setIsPageVisible(!document.hidden)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  return isPageVisible
}
