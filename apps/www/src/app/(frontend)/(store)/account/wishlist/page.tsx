import { getCurrentUser } from "@/actions/auth/get-current-user"
import { WishlistGrid } from "@/components/wishlist/grid"
import { getWishlistItems } from "@/lib/utils/wishlists/get-wishlist-items"
import { Button } from "@eurofit/ui/components/button"
import { Heart } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false },
}

export default async function WishlistPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login" + "?next=" + encodeURIComponent("/account/wishlist"))
  }

  const items = await getWishlistItems({ userId: user.id })

  return (
    <div className="space-y-6">
      <hgroup>
        <h3 className="text-lg font-medium">Wishlist</h3>
        <p className="text-sm text-muted-foreground">
          {items.length > 0
            ? `${items.length} saved item${items.length === 1 ? "" : "s"}`
            : "View and manage your saved items."}
        </p>
      </hgroup>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Heart className="size-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">Your wishlist is empty</p>
            <p className="text-sm text-muted-foreground">
              Save items you love by tapping the heart icon on any product.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <WishlistGrid items={items} />
      )}
    </div>
  )
}
