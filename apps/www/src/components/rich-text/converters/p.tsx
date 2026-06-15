import { P } from "@/components/typography"
import { SerializedParagraphNode } from "@payloadcms/richtext-lexical"
import { JSXConverters } from "@payloadcms/richtext-lexical/react"

export const paragraphConverter: JSXConverters<SerializedParagraphNode> = {
  paragraph: ({ node, nodesToJSX }) => {
    const content = nodesToJSX({ nodes: node.children })
    return <P>{content}</P>
  },
}
