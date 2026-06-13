import bwipjs from "bwip-js"

export async function generateBarcode(
  value: string,
  opts?: bwipjs.RenderOptions
) {
  const png = await bwipjs.toBuffer({
    bcid: "code128",
    text: value,
    scale: 4,
    height: 10,
    includetext: true,
    textxalign: "right",
    ...opts,
  })

  return `data:image/png;base64,${png.toString("base64")}`
}
