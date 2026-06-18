import { Whatsapp } from "@/components/icons/whatsapp"
import { site } from "@/const/site"
import { buildWhatsAppLink } from "@/lib/utils/build-wa-link"
import { buildReviewQuestionMessage } from "@/lib/utils/reviews/build-review-question-message"
import { Button } from "@eurofit/ui/components/button"
import Link from "next/link"

type VariantInfo = {
  title: string
  variant?: string | null
  sku: string
}

export function AskQuestionButton({ variant }: { variant: VariantInfo }) {
  return (
    <Button variant="outline" className="text-whatsapp" asChild>
      <Link
        href={buildWhatsAppLink({
          phone: site.contact.whatsapp,
          message: buildReviewQuestionMessage(variant),
        })}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Whatsapp aria-hidden="true" />
        Ask a question
      </Link>
    </Button>
  )
}
