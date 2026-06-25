import { getCurrentUser } from "@/actions/auth/get-current-user"
import { Button } from "@eurofit/ui/components/button"
import { User } from "lucide-react"
import { UserButtonClient } from "./user-button-client"

export async function UserButton({ className }: { className?: string }) {
  const user = await getCurrentUser()
  return <UserButtonClient user={user} className={className} />
}

export function UserButtonSkeleton() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="relative text-muted-foreground"
      disabled
    >
      <User />
      <span className="sr-only"></span>
    </Button>
  )
}
