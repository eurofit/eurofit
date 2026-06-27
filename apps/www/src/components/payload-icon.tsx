import type { LucideIcon } from "lucide-react"
import { icons } from "lucide-react"

type PayloadIconProps = {
  name: string | null | undefined
  size?: number
  className?: string
  fill?: string | null
}

export function PayloadIcon({
  name,
  size = 16,
  className,
  fill,
}: PayloadIconProps) {
  if (!name) return null
  const Icon = icons[name as keyof typeof icons] as LucideIcon | undefined
  if (!Icon) return null
  return <Icon size={size} className={className} color={fill ?? undefined} />
}
