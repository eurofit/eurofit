import { JsonLd } from "@/components/json-ld"
import { ProductDetailPage } from "@/components/product-variants/product-detail-page"
import { site } from "@/const/site"
import { buildProductVariantDescription } from "@/lib/utils/product-variants/build-product-variant-description"
import { getProductVariantBySlug } from "@/lib/utils/product-variants/get-product-variant-by-slug"
import { getProductVariantJsonLd } from "@/lib/utils/product-variants/get-product-variant-json-ld"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

type ProductPageProps = {
  params: Promise<{
    productVariantSlug: string
  }>
}

export async function generateMetadata({
  params: paramsPromise,
}: ProductPageProps): Promise<Metadata> {
  const { productVariantSlug: slug } = await paramsPromise

  const productVarint = await getProductVariantBySlug({ slug })

  if (!productVarint) {
    notFound()
  }

  const title = productVarint.meta?.title || productVarint.title
  const description =
    productVarint.meta?.description ||
    buildProductVariantDescription(productVarint)
  const image = productVarint.meta?.image ?? productVarint.images[0]
  const canonicalUrl = `${site.url}/product-variants/${productVarint.slug}`

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: site.name,
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function ProductVariantPage({ params }: ProductPageProps) {
  const { productVariantSlug: slug } = await params

  const productVariant = await getProductVariantBySlug({ slug })

  if (!productVariant) notFound()

  return (
    <>
      <JsonLd jsonLd={getProductVariantJsonLd(productVariant)} />
      <Suspense>
        <ProductDetailPage product={productVariant} />
      </Suspense>
    </>
  )
}
