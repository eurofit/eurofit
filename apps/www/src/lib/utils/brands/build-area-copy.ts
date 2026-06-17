import { site } from "@/const/site"
import { formatWithCommas } from "@/lib/utils/format-with-commas"
import { ServiceAreaDetail } from "@/types/service-area"

type AreaCopyArea = Pick<
  ServiceAreaDetail,
  "title" | "deliveryTime" | "lowestShippingRate"
>

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

/** "Ksh 350" — shared price formatting for area delivery copy. */
export function formatDeliveryPrice(price: number): string {
  return `Ksh ${formatWithCommas(price)}`
}

/** Page <h1> — e.g. "Buy Optimum Nutrition in Kisumu" */
export function areaH1(brandTitle: string, area: AreaCopyArea): string {
  return `Buy ${brandTitle} in ${area.title}`
}

/** Metadata <title> — e.g. "Buy Original Optimum Nutrition Supplements in Kisumu, Kenya" */
export function areaPageTitle(brandTitle: string, area: AreaCopyArea): string {
  return `Buy Original ${brandTitle} Supplements in ${area.title}, Kenya`
}

/** Header subtitle, weaving in the area's delivery window and lowest fee. */
export function areaPageSubtitle(
  brandTitle: string,
  area: AreaCopyArea
): string {
  const window = formatDeliveryWindow(area.deliveryTime)

  if (area.lowestShippingRate !== null) {
    return `Shop authentic ${brandTitle} supplements in ${area.title}, delivered in ${window} from ${formatDeliveryPrice(area.lowestShippingRate)}.`
  }

  return `Shop authentic ${brandTitle} supplements in ${area.title}, delivered in ${window}.`
}

/** Metadata description. Includes the product count and lowest delivery fee when available. */
export function areaMetaDescription(
  brandTitle: string,
  area: AreaCopyArea,
  totalVariants: number
): string {
  const catalogue =
    totalVariants > 0
      ? `Shop ${totalVariants}+ authentic ${brandTitle} supplements`
      : `Shop authentic ${brandTitle} supplements`

  const window = formatDeliveryWindow(area.deliveryTime)
  const delivery =
    area.lowestShippingRate !== null
      ? `delivery to ${area.title} from ${formatDeliveryPrice(area.lowestShippingRate)} in ${window}`
      : `delivery in ${window}`

  return `${catalogue} in ${area.title}, Kenya. Verified products, fair prices, and ${delivery} from ${site.name}.`
}

/** Self-referencing canonical URL for an area page. */
export function areaCanonical(brandSlug: string, areaSlug: string): string {
  return `${site.url}/brands/${brandSlug}/${areaSlug}`
}

type AreaFaq = {
  question: string
  answer: string
}

/**
 * Area-specific FAQ, populated with the area's real delivery numbers so each
 * landing page carries unique, on-page content (and FAQPage rich results).
 */
export function buildAreaFaqs(
  brandTitle: string,
  area: AreaCopyArea
): AreaFaq[] {
  const window = formatDeliveryWindow(area.deliveryTime)

  const deliveryCostAnswer =
    area.lowestShippingRate !== null
      ? `Delivery of ${brandTitle} supplements to ${area.title} starts from ${formatDeliveryPrice(area.lowestShippingRate)}. The exact fee depends on the size and weight of your order.`
      : `Delivery fees for ${brandTitle} supplements to ${area.title} depend on the size and weight of your order. Contact us for a quote.`

  return [
    {
      question: `How much does delivery of ${brandTitle} to ${area.title} cost?`,
      answer: deliveryCostAnswer,
    },
    {
      question: `How long does delivery to ${area.title} take?`,
      answer: `Orders to ${area.title} are typically delivered within ${window} after dispatch.`,
    },
    {
      question: `Is ${brandTitle} available in ${area.title}?`,
      answer: `Yes. ${site.name} stocks authentic ${brandTitle} supplements and delivers them to ${area.title} and across Kenya.`,
    },
    {
      question: `How is the delivery fee to ${area.title} calculated?`,
      answer: `Delivery is priced per package size tier for ${area.title}. Larger or heavier orders fall into a higher tier, so you only pay for the space your order needs.`,
    },
  ]
}
