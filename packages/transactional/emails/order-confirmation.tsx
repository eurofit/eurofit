import {
  Column,
  Container,
  Head,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  render,
} from "react-email"

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
  customer: {
    name: string
  }
  order: {
    id: string
    items: Item[]
    total: number
    subtotal: number
    discountTotal: number
    deliveryFee: number
  }
  orderUrl: string
  siteUrl: string
}
export default function OrderConfirmation({
  customer,
  order,
  orderUrl,
  siteUrl,
}: OrderConfirmationProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Order",
    "@id": orderUrl,
    orderNumber: order.id,
    priceCurrency: "KES",
    price: order.total,
    seller: { "@id": `${siteUrl}/#organization` },
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
      url: `${siteUrl}/orders/${order.id}`,
    },
  }

  return (
    <html>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <Tailwind>
        <body className="bg-gray-50 font-sans text-gray-900">
          <Preview>Your Eurofit order #{order.id} has been received</Preview>
          <Container className="mx-auto max-w-150">
            {/* Header */}
            <Section className="my-6 px-4 py-6">
              <Row>
                <Column align="center">
                  <span className="logo light">
                    <Img
                      alt="Eurofit Logo Light"
                      height="28"
                      src={`${siteUrl}/logos/logo-light.png`}
                    />
                  </span>
                  <span className="logo dark" style={{ display: "none" }}>
                    <Img
                      alt="Eurofit Logo Dark"
                      height="28"
                      src={`${siteUrl}/logos/logo-dark.png`}
                    />
                  </span>
                </Column>
              </Row>

              <Row className="mt-6">
                <Column align="center">
                  <table>
                    <tr>
                      <td className="px-2">
                        <Link
                          className="text-gray-600 [text-decoration:none]"
                          href={`${siteUrl}/brands`}
                        >
                          Brands
                        </Link>
                      </td>
                      <td className="px-2">
                        <Link
                          className="text-gray-600 [text-decoration:none]"
                          href={`${siteUrl}/categories`}
                        >
                          Categories
                        </Link>
                      </td>
                      <td className="px-2">
                        <Link
                          className="text-gray-600 [text-decoration:none]"
                          href={`${siteUrl}/contact-us`}
                        >
                          Contact
                        </Link>
                      </td>
                      <td className="px-2">
                        <Link
                          className="text-gray-600 [text-decoration:none]"
                          href={`${siteUrl}/about-us`}
                        >
                          About
                        </Link>
                      </td>
                    </tr>
                  </table>
                </Column>
              </Row>
            </Section>

            {/* Body */}
            <Section className="px-4">
              <Text className="text-lg font-semibold">Hi {customer.name},</Text>

              <Text>
                Thank you for shopping with <strong>EUROFIT</strong>. This is
                just a quick email to say we have recieved your order and
                everything is now in our system.
              </Text>

              {/* Order ID Highlight */}
              <Section className="my-6 rounded-lg bg-gray-100 py-4 text-center">
                <Text className="m-0 text-sm text-gray-600">Order Number</Text>
                <Text className="m-0 text-2xl font-bold">#{order.id}</Text>
              </Section>

              <Text>
                Our team is currently reviewing the order and preparing the
                items for shipment. As soon as everything is confirmed and ready
                to leave our warehouse, we’ll send you another email with the{" "}
                <strong>tracking details and delivery updates</strong>.
              </Text>

              <Text>Here is a quick summary of the items in your order:</Text>

              <Section className="mt-6 px-4">
                {/* Items Header */}
                <Row>
                  <Column>
                    <Text className="text-lg font-semibold">Items</Text>
                  </Column>
                  <Column align="right">
                    <Text className="text-lg font-semibold">Price</Text>
                  </Column>
                </Row>

                {/* Divider */}
                <Section className="mb-6 border-t border-gray-200" />

                {order.items.map((item, index) => (
                  <Row
                    key={item.variant}
                    style={{ marginTop: index > 0 ? 8 : undefined }}
                  >
                    {/* Product Image */}
                    <Column width="70" style={{ verticalAlign: "top" }}>
                      {item.product.image ? (
                        <Img
                          src={item.product.image}
                          alt={item.product.title}
                          width="60"
                          height="60"
                          style={{
                            borderRadius: "6px",
                            backgroundColor: "#f3f4f6",
                          }}
                        />
                      ) : (
                        <Text>N/A</Text>
                      )}
                    </Column>

                    {/* Product Details */}
                    <Column style={{ verticalAlign: "top" }}>
                      <Text className="m-0 font-semibold">
                        {item.product.title}
                      </Text>

                      <Text className="m-0 text-gray-500">{item.variant}</Text>

                      <Text className="m-0 text-gray-500">
                        Qty: {item.quantity}
                      </Text>
                    </Column>

                    {/* Price */}
                    <Column align="right" style={{ verticalAlign: "top" }}>
                      <Text className="my-0 py-0 font-semibold">
                        Ksh {(item.price * item.quantity).toLocaleString()}
                      </Text>
                    </Column>
                  </Row>
                ))}
              </Section>
              <Section className="my-4 border-t border-gray-200" />
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

                {order.discountTotal > 0 && (
                  <Row className="mt-1">
                    <Column>
                      <Text className="mt-0 py-0">Discount</Text>
                    </Column>
                    <Column align="right">
                      <Text className="mt-0 py-0 text-green-600">
                        − Ksh {order.discountTotal.toLocaleString()}
                      </Text>
                    </Column>
                  </Row>
                )}

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

                <Section className="my-4 border-t border-gray-200" />

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

              <Section className="my-4 border-t border-gray-200" />

              <Text>
                Once your order is packed and dispatched, we’ll keep you updated
                so you always know where your package is.
              </Text>

              <Text>
                If anything about your order needs clarification, or if you
                simply want an update, feel free to reach out. You can contact
                us directly here:
              </Text>

              <Row className="mt-3">
                {/* Email Button */}
                <Column width="50%" className="pr-2">
                  <table
                    role="presentation"
                    width="100%"
                    cellPadding="0"
                    cellSpacing="0"
                    style={{
                      backgroundColor: "#f3f4f6",
                      borderRadius: "8px",
                    }}
                  >
                    <tr>
                      <td
                        style={{
                          verticalAlign: "middle",
                          padding: "10px 12px",
                        }}
                      >
                        <Link
                          href="mailto:info@eurofit.co.ke"
                          style={{
                            textDecoration: "none",
                            color: "#111827",
                            fontSize: "14px",
                          }}
                        >
                          <Text className="m-0 p-0 text-sm text-gray-600">
                            Email
                          </Text>
                          info@eurofit.co.ke
                        </Link>
                      </td>
                    </tr>
                  </table>
                </Column>

                {/* Phone Button */}
                <Column width="50%" className="pl-2">
                  <table
                    role="presentation"
                    width="100%"
                    cellPadding="0"
                    cellSpacing="0"
                    style={{
                      backgroundColor: "#f3f4f6",
                      borderRadius: "8px",
                    }}
                  >
                    <tr>
                      <td
                        style={{
                          verticalAlign: "middle",
                          padding: "10px 12px",
                        }}
                      >
                        <Link
                          href="https://wa.me/254110990666"
                          style={{
                            textDecoration: "none",
                            color: "#111827",
                            fontSize: "14px",
                          }}
                        >
                          <Text className="m-0 p-0 text-sm text-gray-600">
                            Whatsapp
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
                Thanks again for choosing EUROFIT. Your support means a lot, and
                our team looks forward to getting your order delivered soon.
              </Text>

              <Text className="mt-6">— The Eurofit Team</Text>
            </Section>

            {/* Footer */}
            <Section className="mt-10 py-6 text-center">
              <table className="w-full">
                <tr className="w-full">
                  <td align="center">
                    <span className="logo light">
                      <Img
                        alt="Eurofit Logo Light"
                        height="20"
                        src={`${siteUrl}/logos/logo-light.png`}
                      />
                    </span>
                    <span className="logo dark" style={{ display: "none" }}>
                      <Img
                        alt="Eurofit Logo Dark"
                        height="20"
                        src={`${siteUrl}/logos/logo-dark.png`}
                      />
                    </span>
                  </td>
                </tr>
                <tr className="w-full">
                  <td align="center">
                    <Text className="mt-1 mb-0 text-[16px] leading-6 text-gray-500">
                      European Fitness, African Strength
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <Row className="table-cell h-11 w-14 align-bottom">
                      <Column className="pr-4">
                        <Link href="https://www.tiktok.com/@eurofitltd">
                          <Img
                            alt="TikTok"
                            height="24"
                            src={`${siteUrl}/logos/tiktok.png`}
                            width="24"
                          />
                        </Link>
                      </Column>
                      <Column className="pr-4">
                        <Link href="https://www.instagram.com/eurofitltd">
                          <Img
                            alt="Instagram"
                            height="24"
                            src={`${siteUrl}/logos/instagram.png`}
                            width="24"
                          />
                        </Link>
                      </Column>
                      <Column className="pr-4">
                        <Link href="https://www.x.com/eurofitltd">
                          <Img
                            alt="X"
                            height="24"
                            src={`${siteUrl}/logos/x.png`}
                            width="24"
                          />
                        </Link>
                      </Column>
                      <Column>
                        <Link href="https://www.facebook.com/eurofitltd">
                          <Img
                            alt="Facebook"
                            height="24"
                            src={`${siteUrl}/logos/facebook.png`}
                            width="24"
                          />
                        </Link>
                      </Column>
                    </Row>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <Text className="my-2 leading-6 font-semibold text-gray-500">
                      Unit 111, 1st Floor, 6th Street Tower, 6th Street,
                      Eastleigh, Nairobi, Kenya
                    </Text>
                    <Text className="mt-1 mb-0 leading-6 font-semibold text-gray-500">
                      info@eurofit.co.ke +254 110 990 660
                    </Text>
                  </td>
                </tr>
              </table>
            </Section>
          </Container>
        </body>
      </Tailwind>
    </html>
  )
}

export function getOrderConfirmationEmailHTML(props: OrderConfirmationProps) {
  return render(<OrderConfirmation {...props} />)
}

export function getOrderConfirmationEmailText(
  props: OrderConfirmationProps
): Promise<string> {
  return render(<OrderConfirmation {...props} />, { plainText: true })
}

OrderConfirmation.PreviewProps = {
  customer: {
    name: "Abdurezak",
  },
  orderUrl: "#",
  siteUrl: "#",
  order: {
    id: "31032026",
    items: [
      {
        quantity: 2,
        price: 5350,
        product: {
          image:
            "https://www.tropicanawholesale.com/Images/Product/Default/xlarge/OPT198.png",
          title: "Optimum Nutrition Whipped Protein Bar 10X68G",
        },
        variant: "10x68g / White Chocolate Salted Caramel & Peanut",
      },
      {
        quantity: 2,
        price: 5350,
        product: {
          image:
            "https://www.tropicanawholesale.com/Images/Product/Default/xlarge/OPT198.png",
          title: "Optimum Nutrition Whipped Protein Bar 10X68G",
        },
        variant: "10x68g / White Chocolate Salted Caramel & Peanut",
      },
      {
        quantity: 2,
        price: 5350,
        product: {
          image:
            "https://www.tropicanawholesale.com/Images/Product/Default/xlarge/OPT198.png",
          title: "Optimum Nutrition Whipped Protein Bar 10X68G",
        },
        variant: "10x68g / White Chocolate Salted Caramel & Peanut",
      },
    ],
    total: 49412,
    subtotal: 52012,
    discountTotal: 3000,
    deliveryFee: 400,
  },
}
