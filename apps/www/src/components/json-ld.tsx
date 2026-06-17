import { Thing, WithContext } from "schema-dts"

type JsonLdProps = {
  jsonLd: WithContext<Thing> | WithContext<Thing>[]
}

function schemaToId(item: WithContext<Thing>): string {
  const schema = item as { "@id"?: string; "@type": string | string[] }
  const type = Array.isArray(schema["@type"])
    ? schema["@type"][0]
    : schema["@type"]
  const source = schema["@id"]?.replace(/^https?:\/\//, "") ?? type ?? "schema"
  const slug = source.replace(/[^a-z0-9]/gi, "-").toLowerCase()
  return `json-ld-${slug}`
}

export function JsonLd({ jsonLd }: JsonLdProps) {
  const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd]

  return (
    <>
      {items.map((item) => (
        <script
          key={schemaToId(item)}
          id={schemaToId(item)}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  )
}
