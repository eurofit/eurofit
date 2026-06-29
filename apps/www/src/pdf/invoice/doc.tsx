import { site } from "@/const/site"
import { STORE } from "@/const/store"
import { APP_TIME_ZONE } from "@/const/time"
import { Invoice } from "@/lib/schemas/invoice"
import { formatWithCommas } from "@/lib/utils/format-with-commas"
import { tz } from "@date-fns/tz"
import { Document, Image, Page, Text, View } from "@react-pdf/renderer"
import { format, formatDate } from "date-fns"
import { PageNumber } from "./page-number"
import { COLORS, styles } from "./styles"

type InvoiceDocProps = {
  data: Invoice
  qrCode: string
  barcode: string
}

function StatusPill({ status }: { status: string }) {
  const isPaymentPaid = status === "paid"
  return (
    <View style={isPaymentPaid ? styles.paidPill : styles.unpaidPill}>
      <Text style={isPaymentPaid ? styles.paidPillText : styles.unpaidPillText}>
        {status}
      </Text>
    </View>
  )
}

function KSh({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Text style={{ fontSize: 7, color: COLORS.muted }}>KSh </Text>
      {children}
    </>
  )
}

export function InvoiceDoc({
  data: invoice,
  qrCode,
  barcode,
}: InvoiceDocProps) {
  const hasDiscountTotal =
    typeof invoice.discountTotal === "number" && invoice.discountTotal > 0
  const hasTax = typeof invoice.tax === "number" && invoice.tax > 0
  const hasDelivery =
    typeof invoice.deliveryFee === "number" && invoice.deliveryFee > 0

  return (
    <Document
      title={`Eurofit – Invoice #${invoice.id} at ${formatDate(invoice.date, "dd/MM/yyyy", { in: tz(APP_TIME_ZONE) })}`}
      author={site.name}
      subject={`Invoice #${invoice.id}`}
      keywords="invoice, eurofit, fitness, supplements"
      creator={site.name}
      producer={site.name}
      language="en-US"
    >
      <Page size="A4" style={styles.page}>
        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          {/* Left: logo + company info */}
          <View>
            <View style={styles.logo}>
              <Text>EURO</Text>
              <Text style={styles.logoAccent}>FIT</Text>
            </View>
            <Text style={styles.tagline}>
              European Fitness, African Strength
            </Text>
            <View style={styles.companyAddress}>
              <Text>
                {site.address.line1}, {site.address.line2}
              </Text>
              <Text>{site.address.postalAddress}</Text>
              <Text>
                {site.address.city}, {site.address.country}
              </Text>
              <Text>+44 7538 584237 / +254 110 990 666</Text>
              <Text>+254 797 722 699</Text>
              <Text>info@eurofit.uk</Text>
            </View>
          </View>

          {/* Right: title + barcode + meta */}
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>Invoice</Text>
            <Image src={barcode} style={{ width: 100, marginTop: 4 }} />
            <View style={styles.metaBox}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>FAO</Text>
                <Text style={styles.metaValue}>{invoice.fao}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Order</Text>
                <Text style={styles.metaValue}>{invoice.id}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Date</Text>
                <Text style={styles.metaValue}>
                  {formatDate(invoice.date, "dd/MM/yyyy", {
                    in: tz(APP_TIME_ZONE),
                  })}
                </Text>
              </View>
              <View style={styles.metaRowLast}>
                <Text style={styles.metaLabel}>Status</Text>
                <StatusPill status={invoice.status} />
              </View>
            </View>
          </View>
        </View>

        {/* ── DIVIDER ─────────────────────────────────────────────────────── */}
        <View style={styles.divider} />

        {/* ── SHIPPING / PICKUP ADDRESS ─────────────────────────────────── */}
        {invoice.isPickup ? (
          <View>
            <Text style={styles.sectionLabel}>Pickup Location</Text>
            <View style={styles.addressText}>
              <Text>{STORE.name}</Text>
              {STORE.addressLines.map((line) => (
                <Text key={line}>{line}</Text>
              ))}
              <Text>{STORE.hours}</Text>
            </View>
          </View>
        ) : invoice.shippingAddress ? (
          <View>
            <Text style={styles.sectionLabel}>Shipping Address</Text>
            <View style={styles.addressText}>
              <Text>
                {[
                  invoice.shippingAddress.title,
                  invoice.shippingAddress.firstName,
                  invoice.shippingAddress.lastName,
                ]
                  .filter(Boolean)
                  .join(" ")}
              </Text>
              <Text>{invoice.shippingAddress.line1}</Text>
              {invoice.shippingAddress.line2 ? (
                <Text>{invoice.shippingAddress.line2}</Text>
              ) : null}
              <Text>
                {invoice.shippingAddress.city},{" "}
                {invoice.shippingAddress.country}
              </Text>
              {invoice.shippingAddress.phone ? (
                <Text>{invoice.shippingAddress.phone}</Text>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* ── ITEMS TABLE ───────────────────────────────────────────────── */}
        <View style={styles.table}>
          {/* Header row */}
          <View style={styles.tableHeaderRow}>
            <View style={styles.colNo}>
              <Text style={styles.tableHeaderCell}>No</Text>
            </View>
            <View style={styles.colDesc}>
              <Text style={styles.tableHeaderCell}>Description</Text>
            </View>
            <View style={styles.colQty}>
              <Text style={styles.tableHeaderCell}>Qty</Text>
            </View>
            <View style={styles.colPrice}>
              <Text style={styles.tableHeaderCell}>Price (KSh)</Text>
            </View>
            <View style={styles.colTotal}>
              <Text style={styles.tableHeaderCell}>Total (KSh)</Text>
            </View>
          </View>

          {/* Data rows */}
          {invoice.items.map((item, index) => {
            const isLastRow = index === invoice.items.length - 1
            const hasLineDiscount =
              typeof item.discount?.price === "number" &&
              item.discount.price < item.price
            const effectiveUnitPrice = hasLineDiscount
              ? item.discount!.price
              : item.price
            const lineTotal = effectiveUnitPrice * item.quantity
            const lineSaving = hasLineDiscount
              ? (item.price - item.discount!.price) * item.quantity
              : 0

            return (
              <View
                key={item.sku}
                style={isLastRow ? styles.tableRowLast : styles.tableRow}
              >
                <View style={styles.colNo}>
                  <Text>{index + 1}</Text>
                </View>
                <View style={styles.colDesc}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <Text style={styles.itemMeta}>SKU: {item.sku}</Text>
                    {item.bbe ? (
                      <Text style={styles.itemMeta}>
                        | BBE: {formatDate(item.bbe, "dd/MM/yyyy")}
                      </Text>
                    ) : null}
                  </View>
                  {hasLineDiscount ? (
                    <Text style={styles.savingsBadge}>
                      Save KSh {formatWithCommas(lineSaving)}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.colQty}>
                  <Text>{item.quantity}</Text>
                </View>
                <View style={styles.colPrice}>
                  {hasLineDiscount ? (
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.originalPrice}>
                        {formatWithCommas(item.price)}
                      </Text>
                      <Text style={styles.discountedPrice}>
                        {formatWithCommas(item.discount!.price)}
                      </Text>
                    </View>
                  ) : (
                    <Text>{formatWithCommas(item.price)}</Text>
                  )}
                </View>
                <View style={styles.colTotal}>
                  <Text>{formatWithCommas(lineTotal)}</Text>
                </View>
              </View>
            )
          })}
        </View>

        {/* ── TOTALS BLOCK ──────────────────────────────────────────────── */}
        <View style={styles.totalsSection} wrap={false}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>
                <KSh>{formatWithCommas(invoice.subtotal)}</KSh>
              </Text>
            </View>

            {hasDiscountTotal ? (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Discount</Text>
                <Text style={styles.totalsDiscountValue}>
                  −KSh {formatWithCommas(invoice.discountTotal!)}
                </Text>
              </View>
            ) : null}

            {hasTax ? (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>VAT</Text>
                <Text style={styles.totalsValue}>
                  <KSh>{formatWithCommas(invoice.tax!)}</KSh>
                </Text>
              </View>
            ) : null}

            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Delivery</Text>
              <Text style={styles.totalsValue}>
                {hasDelivery ? (
                  <KSh>{formatWithCommas(invoice.deliveryFee!)}</KSh>
                ) : (
                  "Free"
                )}
              </Text>
            </View>

            <View style={styles.totalsRowTotal}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                <KSh>
                  {invoice.total ? formatWithCommas(invoice.total) : "N/A"}
                </KSh>
              </Text>
            </View>
          </View>
        </View>

        {/* ── THANK-YOU STRIP ───────────────────────────────────────────── */}
        <View style={styles.thankYouStrip}>
          <View>
            <Text style={styles.thankYouBold}>
              Thank you for shopping with Eurofit!
            </Text>
            <Text style={styles.thankYouText}>
              Questions about your order? Contact us at info@eurofit.uk
            </Text>
            <Text style={styles.thankYouText}>
              or call +254 110 990 666 / +254 797 722 699
            </Text>
          </View>
        </View>

        <View style={{ marginTop: "auto" }} />

        {/* ── FOOTER ────────────────────────────────────────────────────── */}
        <View fixed style={styles.footer}>
          <View>
            <PageNumber />
            <Text style={styles.footerText}>
              Printed on:{" "}
              {format(new Date(), "dd/MM/yyyy HH:mm:ss", {
                in: tz(APP_TIME_ZONE),
              })}
            </Text>
          </View>

          <View style={styles.footerRight}>
            <Text style={styles.footerReviewLabel}>
              Happy? Scan to leave us a review.
            </Text>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              src={qrCode}
              style={{ width: 48, height: 48, objectFit: "contain" }}
            />
          </View>
        </View>
      </Page>
    </Document>
  )
}
