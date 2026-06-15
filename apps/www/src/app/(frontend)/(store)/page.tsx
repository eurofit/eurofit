import { RenderBlocks } from "@/blocks/render-blocks"
import { JsonLd } from "@/components/json-ld"
import { getFaqJsonLd } from "@/lib/utils/get-faqs-json-ld"
import config from "@/payload.config"
import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext"
import { notFound } from "next/navigation"
import { getPayload } from "payload"

export default async function Home() {
  const payload = await getPayload({
    config,
  })

  const {
    docs: [page],
  } = await payload.find({
    collection: "pages",
    where: {
      slug: {
        equals: "home",
      },
    },
    populate: {
      products: {
        slug: true,
        title: true,
        supplierImageUrl: true,
      },
    },
    limit: 1,
    pagination: false,
  })

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
