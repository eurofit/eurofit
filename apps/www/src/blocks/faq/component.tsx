import { smConverters } from "@/components/rich-text/converters/sm"
import { FAQBlock } from "@/payload-types"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@eurofit/ui/components/accordion"
import { cn } from "@eurofit/ui/lib/utils"
import { RichText } from "@payloadcms/richtext-lexical/react"

export function Faq({ faqs, center }: FAQBlock) {
  return (
    <section
      className={cn("max-w-lg space-y-6", {
        "mx-auto": center,
      })}
    >
      <h2 className="text-2xl font-bold">Frequently Asked Questions (FAQs)</h2>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="faq-item-1"
      >
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-item-${index + 1}`}
            className=""
          >
            <AccordionTrigger className="text-base">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              <RichText data={faq.answer} converters={smConverters} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
