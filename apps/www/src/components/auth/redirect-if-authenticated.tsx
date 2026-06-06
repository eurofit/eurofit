import { getCurrentUser } from "@/actions/auth/get-current-user"
import { redirect } from "next/navigation"

type RedirectIfAuthenticatedProps = {
  searchParams?: Promise<{ next?: string }>
}

export async function RedirectIfAuthenticated({
  searchParams,
}: RedirectIfAuthenticatedProps) {
  const [user, params] = await Promise.all([
    getCurrentUser(),
    searchParams ?? Promise.resolve<{ next?: string }>({}),
  ])

  if (user) redirect(params.next ?? "/")

  return null
}
