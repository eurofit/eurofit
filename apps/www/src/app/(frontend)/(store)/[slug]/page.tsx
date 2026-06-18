import { PageContent } from "@/components/pages/page-content"
import * as React from "react"

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default function Page({ params }: Props) {
  const slug = params.then((p) => p.slug)

  return (
    <React.Suspense fallback={<div />}>
      <PageContent slug={slug} />
    </React.Suspense>
  )
}
