import { getBrand } from "@/actions/brands/get-brand"
import {
  buildAreaFaqs,
  formatDeliveryPrice,
  formatDeliveryWindow,
} from "@/lib/utils/brands/build-area-copy"
import { ServiceAreaDetail } from "@/types/service-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@eurofit/ui/components/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@eurofit/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@eurofit/ui/components/table"
import { TruckIcon } from "lucide-react"

type AreaDeliveryInfoProps = {
  slug: Promise<string>
  area: Promise<ServiceAreaDetail | null>
}

export async function AreaDeliveryInfo({
  slug: slugPromise,
  area: areaPromise,
}: AreaDeliveryInfoProps) {
  const [slug, area] = await Promise.all([slugPromise, areaPromise])

  if (!area) return null

  const brand = await getBrand({ slug })

  if (!brand) return null

  const deliveryWindow = formatDeliveryWindow(area.deliveryTime)
  const faqs = buildAreaFaqs(brand.title, area)
  const hasShippingRates = area.shippingRates.length > 0

  return (
    <section
      aria-labelledby="area-delivery-heading"
      className="grid gap-6 lg:grid-cols-2"
    >
      <Card>
        <CardHeader>
          <CardTitle
            id="area-delivery-heading"
            className="flex items-center gap-2"
          >
            <TruckIcon className="size-5 text-muted-foreground" />
            Delivery to {area.title}
          </CardTitle>
          <CardDescription>
            {area.lowestShippingRate !== null ? (
              <>
                Delivered in {deliveryWindow}, from{" "}
                <span className="font-semibold text-foreground">
                  {formatDeliveryPrice(area.lowestShippingRate)}
                </span>
                .
              </>
            ) : (
              <>Delivered in {deliveryWindow}.</>
            )}
          </CardDescription>
        </CardHeader>

        {hasShippingRates && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package size</TableHead>
                  <TableHead className="text-right">Delivery fee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {area.shippingRates.map((rate) => (
                  <TableRow key={`${rate.packageTitle}-${rate.price}`}>
                    <TableCell>
                      <span>{rate.packageTitle}</span>
                      {rate.maxWeight !== null && (
                        <span className="block text-sm text-muted-foreground">
                          Maximum weight: {rate.maxWeight} kg
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDeliveryPrice(rate.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery FAQs for {area.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  )
}
