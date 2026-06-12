"use client"

import { logout } from "@/actions/auth/logout"
import { DropdownMenuItem } from "@eurofit/ui/components/dropdown-menu"
import { useRouter } from "nextjs-toploader/app"
import { toast } from "sonner"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () =>
    toast.promise(logout(), {
      loading: "Logging out...",
      success: (data) => {
        if (!data.success) {
          throw new Error(data.message)
        }

        router.push("/login")

        return "Successfully logged out. See you again soon!"
      },
      error: () => {
        return "Logout failed. Please try again."
      },
    })

  return (
    <DropdownMenuItem variant="destructive" onClick={handleLogout}>
      Log out
    </DropdownMenuItem>
  )
}
