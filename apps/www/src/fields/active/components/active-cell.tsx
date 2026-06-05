import type { DefaultCellComponentProps } from "payload"

export default function ActiveCell({ cellData }: DefaultCellComponentProps) {
  const active = Boolean(cellData)

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block size-4 rounded-full ${active ? "bg-green-700" : "bg-gray-400"}`}
      />
      <span className={`font-medium ${active ? "" : "text-gray-500"}`}>
        {active ? "Active" : "Suspended"}
      </span>
    </div>
  )
}
