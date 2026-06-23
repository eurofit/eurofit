import { captureError } from "@/lib/observability/capture-error"
import { buildGoogleMerchantXml } from "@/lib/utils/feeds/build-google-merchant-xml"
import { getProductVariantsFeed } from "@/lib/utils/product-variants/get-product-variants-feed"

/** Google Merchant Center scheduled product feed (RSS 2.0). */
export async function GET() {
  try {
    const items = await getProductVariantsFeed()
    const xml = buildGoogleMerchantXml(items)

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    })
  } catch (error) {
    captureError(error, { scope: "feed.google-merchant" })
    return new Response("Failed to build feed.", { status: 500 })
  }
}
