import { converters } from "@/components/rich-text/converters"
import { RichTextBlock } from "@/payload-types"
import { RichText as RichTextConverter } from "@payloadcms/richtext-lexical/react"

export function RichText({ content }: RichTextBlock) {
  return (
    <RichTextConverter
      data={content}
      converters={converters}
      className="max-w-3xl"
    />
  )
}
