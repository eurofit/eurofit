import { Button } from "@eurofit/ui/components/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

type ContactCardProps = {
  icon: React.ReactNode
  title: string
  description: string
  cta?: {
    label: string
    href: string
    external?: boolean
    btn?: boolean
  }
}

export function ContactCard({
  icon,
  title,
  description,
  cta,
}: ContactCardProps) {
  const Comp = cta?.external ? "a" : Link
  return (
    <div className="w-full max-w-md">
      <div className="space-y-2 px-4 py-2">
        <div className="flex items-center gap-2 [&_svg]:text-primary">
          {icon}
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        {cta &&
          (cta.btn ? (
            <Comp
              href={cta.href}
              {...(!!cta.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <Button variant="outline" className="group mt-2">
                {cta.label}
                <ChevronRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Comp>
          ) : (
            <Link
              href={cta.href}
              className="hover:underline hover:decoration-primary hover:underline-offset-4"
            >
              {cta.label}
            </Link>
          ))}
      </div>
    </div>
  )
}
