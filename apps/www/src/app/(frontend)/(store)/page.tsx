import { getPage } from "@/actions/pages/get-page"
import { RenderBlocks } from "@/blocks/render-blocks"
import { JsonLd } from "@/components/json-ld"
import { site } from "@/const/site"
import { getFaqJsonLd } from "@/lib/utils/get-faqs-json-ld"
import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("home")
  const meta = page?.meta

  if (!meta) return {}

  const image = typeof meta.image === "object" ? meta.image?.url : undefined

  return {
    title: meta.title ? { absolute: meta.title } : undefined,
    description: meta.description || undefined,
    openGraph: {
      type: "website",
      url: site.url,
      siteName: site.name,
      title: meta.title || undefined,
      description: meta.description || undefined,
      images: image ? [{ url: image }] : undefined,
    },
  }
}

export default async function Home() {
  const page = await getPage("home")

  if (!page) {
    notFound()
  }

  const faqs = page?.layout
    ?.filter((block) => block.blockType == "faq")
    .flatMap((block) =>
      block.faqs.map((faq) => ({
        ...faq,
        answer: convertLexicalToPlaintext({ data: faq.answer }),
      }))
    )

  const faqJsonLd = getFaqJsonLd(faqs)

  return (
    <>
      <JsonLd jsonLd={[faqJsonLd]} />
      <div className="relative w-full space-y-10 lg:space-y-14">
        <RenderBlocks blocks={page?.layout} />
      </div>
    </>
  )
}
