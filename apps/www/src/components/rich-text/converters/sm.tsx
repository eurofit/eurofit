import { cn } from "@eurofit/ui/lib/utils"
import { DefaultNodeTypes } from "@payloadcms/richtext-lexical"
import { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react"

type NodeTypes = DefaultNodeTypes

export const smConverters: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => {
    const content = nodesToJSX({ nodes: node.children })

    return <p className="leading-6 not-first:mt-2">{content}</p>
  },
  list: ({ node, nodesToJSX }) => {
    const content = nodesToJSX({ nodes: node.children })

    const Comp = node.listType === "number" ? "ol" : "ul"

    return (
      <Comp
        className={cn("my-3 ml-3 [&>li]:mt-2", {
          "list-disc": node.listType === "bullet",
          "list-decimal": node.listType === "number",
          'list-inside [&>li]:before:content-["✓"]': node.listType === "check",
        })}
      >
        {content}
      </Comp>
    )
  },
})
