import { H1, H2, H3, H4, H5, H6 } from "@/components/typography"
import { slugify } from "@/lib/utils/slugify"
import { SerializedHeadingNode } from "@payloadcms/richtext-lexical"
import { JSXConverters } from "@payloadcms/richtext-lexical/react"
import * as React from "react"

const headings = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
}

export const headingConverter: JSXConverters<SerializedHeadingNode> = {
  heading: ({ node, nodesToJSX }) => {
    const content = nodesToJSX({ nodes: node.children })

    const text =
      typeof content === "string"
        ? content
        : Array.isArray(content)
          ? content.join("")
          : ""

    const slug = slugify(text)

    if (node.tag in headings) {
      const Comp = headings[node.tag]
      return <Comp id={slug}>{text}</Comp>
    }
    const Tag = node.tag as keyof React.JSX.IntrinsicElements
    return <Tag>{content}</Tag>
  },
}
