import { getCurrentUser } from "@/actions/auth/get-current-user"
import { ProductDetailPage } from "@/components/product-variants/product-detail-page"
import { getProductVariantBySlug } from "@/lib/utils/product-variants/get-product-variant-by-slug"
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

  if ("errors" in productVarint || "properties" in productVarint) {
    throw new Error("Something went wrong!")
  }

  return {
    title: {
      absolute: productVarint.title,
    },
  }
}

export default async function ProductLinePage({ params }: ProductPageProps) {
  const { productVariantSlug: slug } = await params

  const [currentUser, productVariant] = await Promise.all([
    getCurrentUser(),
    getProductVariantBySlug({ slug }),
  ])

  if (!productVariant) notFound()

  if ("errors" in productVariant || "properties" in productVariant) {
    throw new Error("Something went wrong!")
  }

  return (
    <ProductDetailPage
      product={productVariant}
      currentUserId={currentUser?.id}
    />
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
