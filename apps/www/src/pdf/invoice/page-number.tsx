import { Text } from "@react-pdf/renderer"

export function PageNumber() {
  return (
    <Text
      render={({ pageNumber, totalPages }) =>
        `Page ${pageNumber} of ${totalPages}`
      }
    />
  )
}
