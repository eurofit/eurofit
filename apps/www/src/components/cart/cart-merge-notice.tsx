"use client"

import { COOKIE_KEYS } from "@/const/keys"
import { useEffect } from "react"
import { toast } from "sonner"

export function CartMergeNotice() {
  useEffect(() => {
    const name = COOKIE_KEYS.CART_MERGE_NOTICE
    const hasMerge = document.cookie
      .split("; ")
      .some((c) => c.startsWith(`${name}=`))
    if (!hasMerge) return

    document.cookie = `${name}=; max-age=0; path=/`
    toast.success("Your saved items have been added to your cart.")
  }, [])

  return null
}
