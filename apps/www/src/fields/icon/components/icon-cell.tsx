"use client"

import type { LucideIcon } from "lucide-react"
import { icons } from "lucide-react"
import type { DefaultCellComponentProps } from "payload"

export function IconCell({ cellData }: DefaultCellComponentProps) {
  if (!cellData) return null

  const Icon = icons[cellData as keyof typeof icons] as LucideIcon | undefined

  if (!Icon) {
    return <span className="text-xs text-gray-400">{cellData as string}</span>
  }

  return (
    <div className="flex items-center gap-2">
      <Icon size={16} />
      <span className="text-xs">{cellData as string}</span>
    </div>
  )
}
