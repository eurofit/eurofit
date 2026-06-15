import { site } from "@/const/site"
import { ServiceAreaDetail } from "@/types/service-area"

type AreaCopyArea = Pick<ServiceAreaDetail, "title" | "deliveryTime">

/**
 * "2–4 business days", or "3 business days" when min and max are equal.
 */
export function formatDeliveryWindow(
  deliveryTime: ServiceAreaDetail["deliveryTime"]
): string {
  const { minDays, maxDays } = deliveryTime
  const days = minDays === maxDays ? `${minDays}` : `${minDays}–${maxDays}`
  const unit = maxDays === 1 ? "business day" : "business days"
  return `${days} ${unit}`
}

/** Page <h1> — e.g. "Buy Optimum Nutrition in Kisumu" */
export function areaH1(brandTitle: string, area: AreaCopyArea): string {
  return `Buy ${brandTitle} in ${area.title}`
}

/** Metadata <title> — e.g. "Buy Original Optimum Nutrition Supplements in Kisumu, Kenya" */
export function areaPageTitle(brandTitle: string, area: AreaCopyArea): string {
  return `Buy Original ${brandTitle} Supplements in ${area.title}, Kenya`
}

/** Header subtitle, weaving in the area's delivery window. */
export function areaPageSubtitle(
  brandTitle: string,
  area: AreaCopyArea
): string {
  return `Shop authentic ${brandTitle} supplements in ${area.title}, delivered in ${formatDeliveryWindow(area.deliveryTime)}.`
}

/** Metadata description. Includes the product count when available. */
export function areaMetaDescription(
  brandTitle: string,
  area: AreaCopyArea,
  totalVariants: number
): string {
  const catalogue =
    totalVariants > 0
      ? `Shop ${totalVariants}+ authentic ${brandTitle} supplements`
      : `Shop authentic ${brandTitle} supplements`

  return `${catalogue} in ${area.title}, Kenya. Verified products, fair prices, and delivery in ${formatDeliveryWindow(area.deliveryTime)} from ${site.name}.`
}

/** Self-referencing canonical URL for an area page. */
export function areaCanonical(brandSlug: string, areaSlug: string): string {
  return `${site.url}/brands/${brandSlug}/${areaSlug}`
}
