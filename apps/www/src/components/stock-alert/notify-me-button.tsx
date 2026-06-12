"use client"

import { createStockAlert as createStockAlertAction } from "@/actions/stock-alert/notify-me"
import { Button } from "@eurofit/ui/components/button"
import { Spinner } from "@eurofit/ui/components/spinner"
import { cn } from "@eurofit/ui/lib/utils"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

type NotifyMeButtonProps = {
  productVariantId: string
  userId?: string | null
  isNotifyRequested: boolean
} & React.ComponentProps<typeof Button>

export function NotifyMeButton({
  productVariantId,
  userId,
  isNotifyRequested,
}: NotifyMeButtonProps) {
  const [isRequested, setIsRequested] = React.useState(isNotifyRequested)
  const { mutate: createStockAlert, isPending } = useMutation({
    mutationFn: createStockAlertAction,
    onSuccess: (isRequested) => {
      toast.success("You will be notified when the product is back in stock!")

      setIsRequested(isRequested)
    },
    onError: () => {
      toast.error("Something went wrong!")
    },
  })

  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (!userId) {
    const nextUrl = `${pathname}${searchParams ? `?${searchParams.toString()}` : ""}`

    return (
      <Button variant="outline" asChild>
        <Link
          href={`/login?next=${nextUrl}`}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Notify Me
        </Link>
      </Button>
    )
  }

  const handleClick = () =>
    createStockAlert({
      userId,
      productVariantId,
    })

  return (
    <Button
      variant={false ? "default" : "outline"}
      size="sm"
      draggable={false}
      className={cn("text-xs select-none", {
        "bg-green-600 text-white hover:bg-green-700": isRequested,
        "border-gray-300 text-gray-700 hover:bg-gray-50": !isRequested,
      })}
      onClick={handleClick}
      disabled={isRequested || isPending}
    >
      {isPending && <Spinner aria-hidden="true" />}
      {!isPending && isRequested && "Will Be Notified"}
      {!isPending && !isRequested && "Notify Me"}
    </Button>
  )
}
