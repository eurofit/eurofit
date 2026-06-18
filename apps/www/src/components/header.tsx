import { UserButton, UserButtonSkeleton } from "@/components/auth/user-button"
import { Cart, CartSkeleton } from "@/components/cart"
import { Logo } from "@/components/logo"
import { MobileMenu, MobileMenuSkeleton } from "@/components/mobile-menu"
import { Nav, NavSkeleton } from "@/components/nav"
import { SearchBar, SearchBarSkeleton } from "@/components/searchbar"
import * as React from "react"
import { SearchSheet, SearchSheetSkeleton } from "./search-sheet"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      {/* Top row: brand · nav · actions */}
      <div className="flex h-14 items-center gap-3 px-4 md:h-16 md:px-6">
        <div className="flex items-center gap-1.5">
          <React.Suspense fallback={<MobileMenuSkeleton />}>
            <MobileMenu />
          </React.Suspense>
          <Logo />
        </div>

        <React.Suspense fallback={<NavSkeleton />}>
          <Nav />
        </React.Suspense>

        <div className="ml-auto flex flex-1 items-center justify-end gap-2 md:gap-3">
          <React.Suspense fallback={<SearchBarSkeleton />}>
            <SearchBar />
          </React.Suspense>
          <React.Suspense fallback={<UserButtonSkeleton />}>
            <UserButton />
          </React.Suspense>
          <React.Suspense fallback={<CartSkeleton />}>
            <Cart />
          </React.Suspense>
        </div>
      </div>

      {/* Mobile-only search row */}
      <div className="flex h-14 items-center px-4 md:hidden">
        <React.Suspense fallback={<SearchSheetSkeleton />}>
          <SearchSheet />
        </React.Suspense>
      </div>
    </header>
  )
}
