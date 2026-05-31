import type { DefaultCellComponentProps } from "payload"

export default function ActiveCell({ cellData }: DefaultCellComponentProps) {
  const active = Boolean(cellData)

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block size-2.5 rounded-full ${active ? "bg-green-500" : "bg-gray-400"}`}
      />
      <span
        className={`text-sm font-medium ${active ? "text-green-700" : "text-gray-500"}`}
      >
        {active ? "Active" : "Suspended"}
      </span>
    </div>
  )
}
