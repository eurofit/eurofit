import { JsonLd } from "@/components/json-ld"
import { ProductDetailPage } from "@/components/product-variants/product-detail-page"
import { site } from "@/const/site"
import { buildProductVariantDescription } from "@/lib/utils/product-variants/build-product-variant-description"
import { getProductVariantBySlug } from "@/lib/utils/product-variants/get-product-variant-by-slug"
import { getProductVariantJsonLd } from "@/lib/utils/product-variants/get-product-variant-json-ld"
import { Metadata } from "next"
import { notFound } from "next/navigation"

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
      <ProductDetailPage product={productVariant} />
    </>
  )
}

// <>
//   <div className="space-y-10">
//     <Breadcrumb>
//       <BreadcrumbList>
//         <BreadcrumbItem>
//           <BreadcrumbLink href="/">Home</BreadcrumbLink>
//         </BreadcrumbItem>
//         <BreadcrumbSeparator />
//         <BreadcrumbItem>Product Variations</BreadcrumbItem>
//         <BreadcrumbSeparator />
//         <BreadcrumbItem>
//           <BreadcrumbPage>{productLine.title}</BreadcrumbPage>
//         </BreadcrumbItem>
//       </BreadcrumbList>
//     </Breadcrumb>

//     <div className="flex gap-6">
//       <div>
//         <ProductImage images={productLine.images} />
//         <Separator className="my-6" />
//         <section className="space-y-2">
//           <h2 className="text-sm font-medium uppercase">Share this product</h2>
//           <ul className="flex items-center gap-2">
//             <li>
//               <Button variant="outline" size="icon-lg" className="rounded-full">
//                 <Facebook />
//                 <span className="sr-only">Share on Facebook</span>
//               </Button>
//             </li>
//             <li>
//               <Button variant="outline" size="icon-lg" className="rounded-full">
//                 <Twitter />
//                 <span className="sr-only">Share on Twitter</span>
//               </Button>
//             </li>
//             <li>
//               <Button variant="outline" size="icon-lg" className="rounded-full">
//                 <Whatsapp />
//                 <span className="sr-only">Share on Whatsapp</span>
//               </Button>
//             </li>
//           </ul>
//         </section>
//       </div>
//       <div className="max-w-2xl">
//         <h1 className="text-2xl font-bold tracking-wide">{productLine.title}</h1>

//         <Link
//           href={`/brands/${productLine.product?.brand?.slug}`}
//           className="text-sm text-blue-500 underline-offset-4 hover:underline"
//         >
//           Visit the {productLine.product?.brand?.title} store
//         </Link>

//         <Separator className="my-4" />
//         <div className="flex items-baseline gap-2">
//           <span className="text-muted-foreground text-sm font-medium uppercase">
//             KSh
//           </span>
//           {productLine.retailPrice && (
//             <p className="text-3xl font-bold">
//               {formatWithCommas(productLine.retailPrice)}
//             </p>
//           )}
//         </div>
//         <p>In stock</p>
//         <div className="flex items-center gap-x-2">
//           <Star className="size-4 fill-gray-400 text-gray-400" />
//           <p className="text-muted-foreground text-sm">(No ratings yet)</p>
//         </div>
//         <Button variant="default" size="lg" className="w-full">
//           Add to cart
//         </Button>
//       </div>
//     </div>

//     <pre>{JSON.stringify(productLine, null, 2)}</pre>
//   </div>
// </>
