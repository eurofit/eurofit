import { site } from "@/const/site"
import { APP_TIME_ZONE } from "@/const/time"
import { Invoice } from "@/lib/schemas/invoice"
import { formatWithCommas } from "@/lib/utils/format-with-commas"
import { tz } from "@date-fns/tz"
import { Document, Image, Page, Text, View } from "@react-pdf/renderer"
import { format, formatDate } from "date-fns"
import truncate from "lodash-es/truncate"
import { PageNumber } from "./page-number"
import { styles } from "./styles"

const Br = () => "\n"

type InvoiceDocProps = {
  data: Invoice
  qrCode: string
  barcode: string
}

export function InvoiceDoc({
  data: invoice,
  qrCode,
  barcode,
}: InvoiceDocProps) {
  return (
    <Document
      title={`Eurofit - Invoice #${invoice.id} at ${formatDate(invoice.date, "dd/MM/yyyy", { in: tz(APP_TIME_ZONE) })}`}
      author={site.name}
      subject={`Invoice #${invoice.id}`}
      keywords="invoice, eurofit, fitness, gym, supplements"
      creator={site.name}
      producer={site.name}
      language="en-US"
    >
      <Page size="A4" style={styles.page}>
        {/* HEADER  */}
        <View style={styles.header}>
          <View>
            <View>
              <View style={styles.logo}>
                <Text>euro</Text>
                <Text style={{ color: "red" }}>fit</Text>
              </View>
              <Text style={styles.subtitle}>
                European Fitness, African Strength
              </Text>
            </View>
            <View style={styles.address}>
              <Text>
                {site.address.line1}, <Br />
                {site.address.line2}, <Br />
                {site.address.postalAddress}, <Br />
                {site.address.city}, {site.address.country}. <Br />
                +44 7538 584237 / +254 110 990 666 <Br />
                +254 797 722 699 <Br />
                info@eurofit.uk
              </Text>
            </View>
          </View>
          <View style={{ alignItems: "flex-end", gap: 2 }}>
            <Text style={styles.title}>Invoice</Text>
            <Image src={barcode} style={{ width: 130 }} />
            <View
              style={{
                position: "relative",
                marginTop: 16,
                width: 170,
                flexDirection: "column",
                border: "1px solid black",
                textTransform: "uppercase",
              }}
            >
              <View
                style={{
                  position: "relative",
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  flexGrow: 1,
                }}
              >
                <View
                  style={{
                    width: "35%",
                    textAlign: "right",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    borderBottom: "1px solid black",
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                  }}
                >
                  <Text style={{ fontWeight: 600 }}>FAO</Text>
                </View>
                <View
                  style={{
                    width: "65%",
                    height: "100%",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderLeft: "1px solid black",
                    borderBottom: "1px solid black",
                    textTransform: "capitalize",
                  }}
                >
                  <Text>{truncate(invoice.fao, { length: 17 })}</Text>
                </View>
              </View>
              <View
                style={{
                  position: "relative",
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  flexGrow: 1,
                  borderBottom: "1px solid black",
                }}
              >
                <View
                  style={{
                    width: "35%",
                    textAlign: "right",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                  }}
                >
                  <Text style={{ fontWeight: 600 }}>ORDER</Text>
                </View>
                <View
                  style={{
                    width: "65%",
                    height: "100%",
                    alignItems: "flex-end",
                    paddingHorizontal: 6,
                    borderLeft: "1px solid black",
                    justifyContent: "center",
                    paddingVertical: 2,
                  }}
                >
                  <Text>{invoice.id}</Text>
                </View>
              </View>
              <View
                style={{
                  position: "relative",
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  flexGrow: 1,
                  borderBottom: "1px solid black",
                }}
              >
                <View
                  style={{
                    width: "35%",
                    textAlign: "right",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                  }}
                >
                  <Text style={{ fontWeight: 600 }}>Date</Text>
                </View>
                <View
                  style={{
                    width: "65%",
                    height: "100%",
                    alignItems: "flex-end",
                    paddingHorizontal: 6,
                    borderLeft: "1px solid black",
                    justifyContent: "center",
                    paddingVertical: 2,
                  }}
                >
                  <Text>
                    {formatDate(invoice.date, "dd/MM/yyyy", {
                      in: tz(APP_TIME_ZONE),
                    })}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  position: "relative",
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  flexGrow: 1,
                }}
              >
                <View
                  style={{
                    width: "35%",
                    textAlign: "right",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                  }}
                >
                  <Text style={{ fontWeight: 600 }}>Status</Text>
                </View>
                <View
                  style={{
                    width: "65%",
                    height: "100%",
                    alignItems: "flex-end",
                    paddingHorizontal: 6,
                    borderLeft: "1px solid black",
                    justifyContent: "center",
                    paddingVertical: 2,
                  }}
                >
                  <Text>{invoice.status}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 24,
            flexDirection: "row",
            textTransform: "capitalize",
          }}
        >
          <View style={{ flexGrow: 1 }}>
            <Text style={{ fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
              Shipping Address
            </Text>
            <View
              style={{
                flexDirection: "column",
                gap: 2,
                fontSize: 11,
                fontWeight: 300,
                color: "#666",
              }}
            >
              <Text>
                {invoice.shippingAddress.title}{" "}
                {invoice.shippingAddress.firstName}{" "}
                {invoice.shippingAddress.lastName}
              </Text>
              <Text>{invoice.shippingAddress.line1}</Text>
              <Text>{invoice.shippingAddress.line2}</Text>
              <Text>
                {invoice.shippingAddress.city},{" "}
                {invoice.shippingAddress.country}
              </Text>
              <Text>{invoice.shippingAddress.phone}</Text>
            </View>
          </View>
        </View>

        {/* TABLE  */}
        <View
          style={{
            marginTop: 24,
            border: "1px solid black",
          }}
        >
          {/* HEADER Row */}
          <View
            style={{
              flexDirection: "row",
              borderBottom: "1px solid black",
              fontSize: 12,
              fontWeight: 700,
              backgroundColor: "#e5e5e5",
            }}
          >
            <View
              style={{
                width: "8%",
                alignContent: "center",
                alignItems: "flex-start",
                borderRight: "1px solid black",
                height: "100%",
                padding: 4,
              }}
            >
              <Text>No</Text>
            </View>
            <View
              style={{
                width: "50%",
                alignItems: "flex-start",
                borderRight: "1px solid black",
                height: "100%",
                flexGrow: 1,
                padding: 4,
              }}
            >
              <Text>Description</Text>
            </View>
            <View
              style={{
                width: "10%",
                alignItems: "center",
                borderRight: "1px solid black",
                height: "100%",
                padding: 4,
              }}
            >
              <Text>Qty</Text>
            </View>
            <View
              style={{
                width: "15%",
                alignItems: "center",
                borderRight: "1px solid black",
                height: "100%",
                padding: 4,
              }}
            >
              <Text>
                Price&nbsp;
                <Text style={{ fontSize: 9, fontWeight: 300 }}>(KSh)</Text>
              </Text>
            </View>
            <View
              style={{
                width: "17%",
                alignItems: "center",
                borderRight: "1px solid black",
                height: "100%",
                padding: 4,
              }}
            >
              <Text>
                Subtotal&nbsp;
                <Text style={{ fontSize: 9, fontWeight: 300 }}>(KSh)</Text>
              </Text>
            </View>
          </View>
          {/* ROWS */}
          {invoice.items.map((item, index) => (
            <View
              key={item.sku}
              style={{
                flexDirection: "row",
                borderBottom:
                  index === invoice.items.length - 1
                    ? undefined
                    : "1px solid black",
                fontSize: 10,
              }}
            >
              <View
                style={{
                  width: "8%",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  borderRight: "1px solid black",
                  height: "100%",
                  padding: 4,
                }}
              >
                <Text>{index + 1}</Text>
              </View>
              <View
                style={{
                  width: "50%",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  borderRight: "1px solid black",
                  height: "100%",
                  flexGrow: 1,
                  padding: 4,
                }}
              >
                <Text style={{ fontWeight: 500, lineHeight: 0.875 }}>
                  {item.title}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 4,
                    fontSize: 9,
                    fontStyle: "italic",
                    marginTop: 2,
                    fontWeight: 300,
                    color: "#666",
                  }}
                >
                  <Text>SKU: {item.sku}</Text>
                  {item.bbe && (
                    <>
                      <Text>|</Text>
                      <Text>BBE: {formatDate(item.bbe, "dd/MM/yyyy")}</Text>
                    </>
                  )}
                </View>
              </View>
              <View
                style={{
                  width: "10%",
                  alignItems: "flex-end",
                  borderRight: "1px solid black",
                  height: "100%",
                  padding: 4,
                }}
              >
                <Text>{item.quantity}</Text>
              </View>
              <View
                style={{
                  width: "15%",
                  alignItems: "flex-end",
                  borderRight: "1px solid black",
                  height: "100%",
                  padding: 4,
                  overflow: "hidden",
                }}
              >
                <Text>{formatWithCommas(item.price)}</Text>
              </View>
              <View
                style={{
                  width: "17%",
                  alignItems: "flex-end",
                  borderRight: "1px solid black",
                  height: "100%",
                  padding: 4,
                  overflow: "hidden",
                }}
              >
                <Text>{formatWithCommas(item.price * item.quantity)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* SUMMARY SECTION */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 24,
            alignItems: "flex-start",
          }}
          wrap={false}
        >
          {/* TABLE */}
          <View
            style={{
              marginLeft: "auto",
              border: "1px solid black",
              width: "39%",
              fontWeight: 700,
            }}
          >
            {/* ROW */}
            <View
              style={{
                position: "relative",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottom: "1px solid black",
              }}
            >
              <View
                style={{
                  padding: 4,
                  textAlign: "right",
                  textTransform: "uppercase",
                  justifyContent: "flex-end",

                  width: "50%",
                  borderRight: "1px solid black",
                }}
              >
                <Text>Subtotal</Text>
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                  justifyContent: "center",
                  padding: 4,
                  textAlign: "right",
                  width: "50%",
                  borderLeft: "1px solid black",
                }}
              >
                <Text>
                  <Text style={{ fontSize: 9 }}>KSh</Text>
                  &nbsp;
                  {formatWithCommas(invoice.subtotal)}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottom: "1px solid black",
              }}
            >
              <View
                style={{
                  padding: 4,
                  textAlign: "right",
                  textTransform: "uppercase",
                  justifyContent: "flex-end",
                  width: "50%",
                  borderRight: "1px solid black",
                }}
              >
                <Text>VAT</Text>
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                  justifyContent: "center",
                  padding: 4,
                  textAlign: "right",
                  width: "50%",
                }}
              >
                <Text>
                  <Text style={{ fontSize: 9, textTransform: "none" }}>
                    KSh
                  </Text>
                  &nbsp;
                  {invoice.tax}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottom: "1px solid black",
                textTransform: "uppercase",
              }}
            >
              <View
                style={{
                  padding: 4,
                  textAlign: "right",
                  justifyContent: "flex-end",
                  width: "50%",
                  borderRight: "1px solid black",
                }}
              >
                <Text style={{ textTransform: "uppercase" }}>Delivery</Text>
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                  justifyContent: "center",
                  padding: 4,
                  textAlign: "right",
                  width: "50%",
                }}
              >
                <Text>
                  <Text style={{ fontSize: 9, textTransform: "none" }}>
                    KSh
                  </Text>
                  &nbsp;
                  {invoice.deliveryFee}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                textTransform: "uppercase",
                backgroundColor: "#e5e5e5",
              }}
            >
              <View
                style={{
                  padding: 6,
                  textAlign: "right",
                  justifyContent: "flex-end",
                  width: "50%",
                  borderRight: "1px solid black",
                }}
              >
                <Text>Total</Text>
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                  justifyContent: "center",
                  padding: 6,
                  textAlign: "right",
                  textTransform: "uppercase",
                  width: "50%",
                }}
              >
                <Text>
                  <Text style={{ fontSize: 9, textTransform: "none" }}>
                    KSh
                  </Text>
                  &nbsp;
                  {invoice.total ? formatWithCommas(invoice.total) : "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginTop: "auto" }} />

        {/* FOOTER  */}
        <View
          fixed
          style={{
            position: "relative",
            height: 60,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 24,
          }}
        >
          <View style={{ gap: 20, marginTop: "auto" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                justifyContent: "flex-end",
              }}
            >
              <PageNumber />
              <Text>
                Printed on:{" "}
                {format(new Date(), "dd/MM/yyyy HH:mm:ss", {
                  in: tz(APP_TIME_ZONE),
                })}
              </Text>
            </View>
          </View>

          <View
            style={{
              position: "relative",
              height: "100%",
              marginLeft: "auto",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                gap: 4,
                alignItems: "flex-end",
                width: 80,
                textAlign: "right",
              }}
            >
              <Text style={{ textAlign: "right" }}>Happy?</Text>
              <Text style={{ textAlign: "right" }}>
                Scan to leave us a review.
              </Text>
            </View>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              src={qrCode}
              style={{
                width: "auto",
                height: "100%",
                objectFit: "contain",
                aspectRatio: 1,
              }}
            />
          </View>
        </View>
      </Page>
    </Document>
  )
}
