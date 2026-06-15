import { headingConverter } from "@/components/rich-text/converters/heading"
import { paragraphConverter } from "@/components/rich-text/converters/p"
import { DefaultNodeTypes } from "@payloadcms/richtext-lexical"
import { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react"
import { listConverter } from "./list"

type NodeTypes = DefaultNodeTypes

export const converters: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  ...headingConverter,
  ...paragraphConverter,
  ...listConverter,
  horizontalrule: () => <hr className="my-4" />,
})
