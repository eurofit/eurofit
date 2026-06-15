import { StyleSheet } from "@react-pdf/renderer"

export const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 11,
    color: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logo: {
    fontSize: 24,
    textTransform: "uppercase",
    flexDirection: "row",
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  address: {
    textTransform: "capitalize",
    lineHeight: 1.5,
    marginTop: 12,
    fontSize: 11,
  },
})
