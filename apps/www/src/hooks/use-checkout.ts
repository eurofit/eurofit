"use client"

import { checkout as checkoutAction } from "@/actions/checkout"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "nextjs-toploader/app"
import { toast } from "sonner"

export function useCheckout() {
  const router = useRouter()

  const checkoutMutation = useMutation({
    mutationFn: ({
      data,
      turnstileToken,
    }: {
      data: Parameters<typeof checkoutAction>[0]
      turnstileToken: string
    }) => checkoutAction(data, turnstileToken),
    mutationKey: ["checkout"],
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message)
        return
      }
      router.push(result.data.authorization_url)
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
