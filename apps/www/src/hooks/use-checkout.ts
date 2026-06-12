"use client"

import { checkout as checkoutAction } from "@/actions/checkout"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useCheckout() {
  const router = useRouter()

  const checkoutMutation = useMutation({
    mutationFn: checkoutAction,
    mutationKey: ["checkout"],
    onSuccess: ({ data: { authorization_url } }) => {
      router.push(authorization_url)
    },
    onError: () => {
      toast.error("An unexpected error occurred.")
    },
  })

  const { mutate: checkout, isPending: isCheckingout, ...r } = checkoutMutation

  return {
    checkout,
    isCheckingout,
    ...r,
  }
}
