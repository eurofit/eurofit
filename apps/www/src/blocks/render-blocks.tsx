import { Page } from "@/payload-types"
import { Faq } from "./faq/component"
import { ProductList } from "./product-list/components/product-list"
import { RichText } from "./rich-text/component"
import { Slider } from "./slider/component"

type RenderBlocksProps = {
  blocks: NonNullable<Page["layout"]>[number][]
}

export function RenderBlocks({ blocks }: RenderBlocksProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }
  return (
    <>
      {blocks.map((block, index) => {
        const { blockType, id } = block
        switch (blockType) {
          case "slider":
            return <Slider key={id ?? index} {...block} />
          case "richText":
            return <RichText key={id} {...block} />
          case "faq":
            return <Faq key={id} {...block} />
          case "productList":
            return <ProductList key={id} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}
