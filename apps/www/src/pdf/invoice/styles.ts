import { StyleSheet } from "@react-pdf/renderer"

export const COLORS = {
  ink: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
  surface: "#F9FAFB",
  accent: "#DC2626",
  paidBg: "#DCFCE7",
  paidText: "#15803D",
  unpaidBg: "#FEF3C7",
  unpaidText: "#B45309",
} as const

export const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 36,
    paddingVertical: 32,
    fontSize: 10,
    color: COLORS.ink,
    fontFamily: "Helvetica",
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logo: {
    fontSize: 22,
    textTransform: "uppercase",
    flexDirection: "row",
    fontWeight: 700,
  },
  logoAccent: {
    color: COLORS.accent,
  },
  tagline: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 2,
  },
  companyAddress: {
    marginTop: 10,
    fontSize: 9,
    color: COLORS.muted,
    lineHeight: 1.55,
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  invoiceTitle: {
    fontSize: 22,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: COLORS.ink,
  },

  // ── Meta box (FAO / ORDER / DATE / STATUS) ────────────────────────────────
  metaBox: {
    marginTop: 8,
    width: 180,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  metaRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  metaLabel: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase",
    color: COLORS.muted,
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 9,
    fontWeight: 600,
    textTransform: "capitalize",
    textAlign: "right",
  },

  // ── Paid / Unpaid pill ────────────────────────────────────────────────────
  paidPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: COLORS.paidBg,
  },
  paidPillText: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase",
    color: COLORS.paidText,
    letterSpacing: 0.5,
  },
  unpaidPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: COLORS.unpaidBg,
  },
  unpaidPillText: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase",
    color: COLORS.unpaidText,
    letterSpacing: 0.5,
  },

  // ── Divider ───────────────────────────────────────────────────────────────
  divider: {
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    marginVertical: 16,
  },

  // ── Shipping address ──────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: COLORS.muted,
    marginBottom: 6,
  },
  addressText: {
    fontSize: 10,
    lineHeight: 1.55,
    textTransform: "capitalize",
  },

  // ── Items table ───────────────────────────────────────────────────────────
  table: {
    marginTop: 16,
  },
  tableHeaderRow: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    backgroundColor: COLORS.surface,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    color: COLORS.muted,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  tableRowLast: {
    flexDirection: "row",
    paddingVertical: 8,
  },

  // Column widths
  colNo: { width: "6%", paddingHorizontal: 4 },
  colDesc: { width: "44%", paddingHorizontal: 4, flexGrow: 1 },
  colQty: { width: "8%", paddingHorizontal: 4, alignItems: "flex-end" },
  colPrice: { width: "18%", paddingHorizontal: 4, alignItems: "flex-end" },
  colTotal: { width: "18%", paddingHorizontal: 4, alignItems: "flex-end" },

  itemTitle: {
    fontSize: 10,
    fontWeight: 600,
    lineHeight: 1.3,
  },
  itemMeta: {
    fontSize: 8,
    color: COLORS.muted,
    fontStyle: "italic",
    marginTop: 2,
  },
  originalPrice: {
    fontSize: 9,
    color: COLORS.muted,
    textDecoration: "line-through",
  },
  discountedPrice: {
    fontSize: 10,
    fontWeight: 600,
    color: COLORS.accent,
  },
  savingsBadge: {
    fontSize: 8,
    color: COLORS.accent,
    marginTop: 2,
  },

  // ── Totals block ──────────────────────────────────────────────────────────
  totalsSection: {
    marginTop: 20,
    flexDirection: "row",
  },
  totalsBox: {
    marginLeft: "auto",
    width: "42%",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  totalsRowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 6,
    marginTop: 2,
  },
  totalsLabel: {
    fontSize: 9,
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    fontWeight: 600,
  },
  totalsValue: {
    fontSize: 9,
    fontWeight: 600,
    textAlign: "right",
  },
  totalsDiscountValue: {
    fontSize: 9,
    fontWeight: 600,
    color: COLORS.accent,
    textAlign: "right",
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 11,
    fontWeight: 700,
    textAlign: "right",
  },

  // ── Thank-you strip ───────────────────────────────────────────────────────
  thankYouStrip: {
    marginTop: 28,
    paddingTop: 12,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  thankYouText: {
    fontSize: 9,
    color: COLORS.muted,
    lineHeight: 1.55,
  },
  thankYouBold: {
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.ink,
    marginBottom: 3,
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    position: "relative",
    marginTop: "auto",
    paddingTop: 10,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerText: {
    fontSize: 8,
    color: COLORS.muted,
    lineHeight: 1.55,
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  footerReviewLabel: {
    fontSize: 8,
    color: COLORS.muted,
    textAlign: "right",
    lineHeight: 1.55,
    width: 70,
  },
})
