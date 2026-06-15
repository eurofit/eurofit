import { getPage } from "@/actions/pages/get-page"
import { RenderBlocks } from "@/blocks/render-blocks"
import { JsonLd } from "@/components/json-ld"
import { getFaqJsonLd } from "@/lib/utils/get-faqs-json-ld"
import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext"
import { notFound } from "next/navigation"

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
