import { cn } from "@eurofit/ui/lib/utils"
import { CheckCircle } from "lucide-react"
import * as React from "react"

type EndMessageProps = {
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

/**
 * Generic "you've reached the end of the list" notice. Reusable across any
 * paginated/infinite list — the caller supplies the copy and an optional CTA
 * via `description`.
 */
export function EndMessage({
  title,
  description,
  icon = <CheckCircle className="text-green-600" />,
  className,
}: EndMessageProps) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "mx-auto mt-8 flex max-w-md flex-col items-center justify-center gap-2 text-center",
        className
      )}
    >
      {icon}
      <div>
        <p>{title}</p>
        {description && <p className="text-sm">{description}</p>}
      </div>
    </div>
  )
}
