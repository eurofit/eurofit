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
    <header className="sticky top-0 z-50 h-30 space-y-2 gap-x-6 border-b bg-background p-4 pb-3 md:h-16 md:px-6">
      <div className="relative flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <React.Suspense fallback={<MobileMenuSkeleton />}>
            <MobileMenu />
          </React.Suspense>
          <Logo />
        </div>
        <React.Suspense fallback={<NavSkeleton />}>
          <Nav />
        </React.Suspense>
        <div className="ml-auto flex flex-1 items-center justify-end gap-x-3">
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
      <React.Suspense fallback={<SearchSheetSkeleton />}>
        <SearchSheet />
      </React.Suspense>
    </header>
  )
}
