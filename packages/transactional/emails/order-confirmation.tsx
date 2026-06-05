import { EmailLayout } from "@eurofit/transactional/layout"
import { Column, Img, Link, Row, Section, Text } from "react-email"

type Item = {
  quantity: number
  price: number
  product: {
    image?: string | null
    title: string
  }
  variant: string
}

export type OrderConfirmationProps = {
  baseUrl: string
  customer: {
    name: string
  }
  order: {
    id: string
    items: Item[]
    total: number
    subtotal: number
    deliveryFee: number
  }
}

export default function OrderConfirmation({
  baseUrl,
  customer,
  order,
}: OrderConfirmationProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Order",
    "@id": `${baseUrl}/orders/${order.id}#order`,
    orderNumber: order.id,
    priceCurrency: "KES",
    price: order.total,
    seller: { "@id": `${baseUrl}/#organization` },
    customer: { "@type": "Person", name: customer.name },
    acceptedOffer: order.items.map((item) => ({
      "@type": "Offer",
      priceCurrency: "KES",
      price: item.price,
      eligibleQuantity: { "@type": "QuantitativeValue", value: item.quantity },
      itemOffered: {
        "@type": "Product",
        name: item.product.title,
        description: item.variant,
        ...(item.product.image && { image: item.product.image }),
      },
    })),
    orderStatus: "https://schema.org/OrderProcessing",
    potentialAction: {
      "@type": "ViewAction",
      name: "View Order",
      url: `${baseUrl}/orders/${order.id}`,
    },
  }

  const headContent = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )

  return (
    <EmailLayout
      baseUrl={baseUrl}
      preview={`Your Eurofit order #${order.id} has been received`}
      headContent={headContent}
    >
      <Section className="px-4">
        <Text className="text-lg font-semibold">Hi {customer.name},</Text>

        <Text>
          Thank you for shopping with <strong>Eurofit</strong>. We&apos;ve
          received your order and it&apos;s now in our system.
        </Text>

        <Section className="my-6 rounded-lg bg-gray-100 py-4 text-center">
          <Text className="m-0 text-sm text-gray-600">Order Number</Text>
          <Text className="m-0 text-2xl font-bold">#{order.id}</Text>
        </Section>

        <Text>
          Our team is reviewing your order and preparing it for shipment. Once
          everything is confirmed and ready to leave our warehouse, we&apos;ll
          send you a separate email with your{" "}
          <strong>tracking details and delivery updates</strong>.
        </Text>

        <Text>Here&apos;s a summary of what you ordered:</Text>

        <Section className="mt-6 px-4">
          <Row>
            <Column>
              <Text className="text-lg font-semibold">Items</Text>
            </Column>
            <Column align="right">
              <Text className="text-lg font-semibold">Price</Text>
            </Column>
          </Row>

          <Section className="mb-6 border-t border-solid border-gray-200" />

          {order.items.map((item, index) => (
            <Row
              key={item.variant}
              style={{ marginTop: index > 0 ? 8 : undefined }}
            >
              <Column width="70" style={{ verticalAlign: "top" }}>
                {item.product.image ? (
                  <Img
                    src={item.product.image}
                    alt={item.product.title}
                    width="60"
                    height="60"
                    style={{ borderRadius: "6px", backgroundColor: "#f3f4f6" }}
                  />
                ) : (
                  <Text>N/A</Text>
                )}
              </Column>

              <Column style={{ verticalAlign: "top" }}>
                <Text className="m-0 font-semibold">{item.product.title}</Text>
                <Text className="m-0 text-gray-500">{item.variant}</Text>
                <Text className="m-0 text-gray-500">Qty: {item.quantity}</Text>
              </Column>

              <Column align="right" style={{ verticalAlign: "top" }}>
                <Text className="my-0 py-0 font-semibold">
                  Ksh {(item.price * item.quantity).toLocaleString()}
                </Text>
              </Column>
            </Row>
          ))}
        </Section>

        <Section className="my-4 border-t border-solid border-gray-200" />

        <Section className="px-4">
          <Row className="mt-0 py-0">
            <Column className="mt-0 py-0">
              <Text className="my-0 py-2">Subtotal</Text>
            </Column>
            <Column align="right" className="my-0 py-2">
              <Text className="my-0 py-2">
                Ksh {order.subtotal.toLocaleString()}
              </Text>
            </Column>
          </Row>

          <Row className="mt-1">
            <Column>
              <Text className="mt-0 py-0">Delivery Fee</Text>
            </Column>
            <Column align="right">
              <Text className="mt-0 py-0">
                Ksh {order.deliveryFee.toLocaleString()}
              </Text>
            </Column>
          </Row>

          <Section className="my-4 border-t border-solid border-gray-200" />

          <Row>
            <Column>
              <Text className="text-lg font-semibold">TOTAL</Text>
            </Column>
            <Column align="right">
              <Text className="text-lg font-semibold">
                Ksh {order.total.toLocaleString()}
              </Text>
            </Column>
          </Row>
        </Section>

        <Section className="my-4 border-t border-solid border-gray-200" />

        <Text>
          Once your order is dispatched, we&apos;ll keep you updated every step
          of the way.
        </Text>

        <Text>
          Need help or have a question about your order? Reach out to us
          directly:
        </Text>

        <Row className="mt-3">
          <Column width="50%" className="pr-2">
            <table
              role="presentation"
              width="100%"
              cellPadding="0"
              cellSpacing="0"
              className="rounded-lg bg-gray-100"
            >
              <tr>
                <td className="p-3">
                  <Link
                    href="mailto:info@eurofit.co.ke"
                    className="text-gray-900 [text-decoration:none]"
                  >
                    <Text className="m-0 p-0 text-sm text-gray-600">Email</Text>
                    info@eurofit.co.ke
                  </Link>
                </td>
              </tr>
            </table>
          </Column>

          <Column width="50%" className="pl-2">
            <table
              role="presentation"
              width="100%"
              cellPadding="0"
              cellSpacing="0"
              className="rounded-lg bg-gray-100"
            >
              <tr>
                <td className="p-3">
                  <Link
                    href="https://wa.me/254110990666"
                    className="text-gray-900 [text-decoration:none]"
                  >
                    <Text className="m-0 p-0 text-sm text-gray-600">
                      WhatsApp
                    </Text>
                    +254 110 990 660
                  </Link>
                </td>
              </tr>
            </table>
          </Column>
        </Row>

        <Text>Our team is always happy to help.</Text>

        <Text className="mt-6">
          Thanks again for choosing Eurofit. We look forward to getting your
          order to you soon.
        </Text>

        <Text className="mt-6">— The Eurofit Team</Text>
      </Section>
    </EmailLayout>
  )
}
