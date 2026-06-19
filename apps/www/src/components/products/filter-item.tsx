"use client"

import { buildFilterToggleUrl } from "@/lib/utils/brands/build-filter-toggle-url"
import { slugify } from "@/lib/utils/slugify"
import { Checkbox } from "@eurofit/ui/components/checkbox"
import { cn } from "@eurofit/ui/lib/utils"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import * as React from "react"

type FilterItemProps = React.ComponentProps<"div"> & {
  queryKey: string
  item: {
    slug: string
    title: string
    count: number
  }
}

export function FilterItem({
  queryKey: key,
  item: { slug, title, count },
  className,
  ...props
}: FilterItemProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isChecked = searchParams.getAll(key).includes(slug)
  const toggleUrl = buildFilterToggleUrl({ searchParams, pathname, key, slug })

  const handleCheckedChange = () => {
    router.replace(toggleUrl)
  }

  return (
    <div className={cn("group flex items-start gap-2.5", className)} {...props}>
      <Checkbox
        id={slugify(key + "-" + title)}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        className="mt-0.5"
      />
      <Link
        href={toggleUrl}
        className="text-sm leading-snug hover:underline hover:underline-offset-4"
        prefetch={false}
        shallow
        replace
      >
        {title}&nbsp;({count})
      </Link>
    </div>
  )
}
