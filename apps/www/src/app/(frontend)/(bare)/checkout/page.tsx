import { getCurrentUser } from "@/actions/auth/get-current-user"
import {
  AddressStep,
  CartStep,
  CheckoutStepper,
  CheckoutStepperHeader,
  ReviewStep,
} from "@/components/checkout/stepper"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function CheckoutPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?next=" + encodeURIComponent("/checkout"))
  }

  return (
    <main className="relative">
      <CheckoutStepper className="mt-6">
        <CheckoutStepperHeader className="mb-10 md:mb-16" />
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-around px-4 md:min-h-[calc(100vh-4rem)] md:flex-row md:px-6">
          <div className="mx-auto flex w-full max-w-2xl grow">
            <div className="mx-auto max-w-xl grow">
              <AddressStep addresses={user.addresses} />
              <CartStep />
              <ReviewStep />
            </div>
          </div>
        </div>
      </CheckoutStepper>
    </main>
  )
}
