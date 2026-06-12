"use client"

import { usePreventScroll } from "@/hooks/use-prevent-scroll"
import React from "react"

type PreventScrollProps = React.PropsWithChildren<{
  isDisabled?: boolean
}>

export function PreventScroll({
  children,
  isDisabled = false,
}: PreventScrollProps) {
  usePreventScroll({
    isDisabled,
  })
  return children
}
