"use client"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@eurofit/ui/components/input-group"
import { Search } from "lucide-react"
import dynamic from "next/dynamic"

export const BrandSearchDynamic = dynamic(
  () => import("./brand-search").then((mod) => mod.BrandSearch),
  {
    loading: () => (
      <div className="relative w-full max-w-md">
        <InputGroup className="bg-background">
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            placeholder="Search brands…"
            autoComplete="off"
            disabled
          />
        </InputGroup>
      </div>
    ),
    ssr: false,
  }
)
