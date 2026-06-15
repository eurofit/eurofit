import { cn } from "@eurofit/ui/lib/utils"
import { SerializedListNode } from "@payloadcms/richtext-lexical"
import { JSXConverters } from "@payloadcms/richtext-lexical/react"

export const listConverter: JSXConverters<SerializedListNode> = {
  list: ({ node, nodesToJSX }) => {
    const content = nodesToJSX({ nodes: node.children })

    const Comp = node.listType === "number" ? "ol" : "ul"

    return (
      <Comp
        className={cn("my-6 ml-6 [&>li]:mt-2", {
          "list-disc": node.listType === "bullet",
          "list-decimal": node.listType === "number",
          'list-inside [&>li]:before:content-["✓"]': node.listType === "check",
        })}
      >
        {content}
      </Comp>
    )
  },
}
