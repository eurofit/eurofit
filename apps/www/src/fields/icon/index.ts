import { mergeWith } from "lodash-es"
import type { TextField } from "payload"

type IconFieldExtension = Omit<Partial<TextField>, "type">

const base: TextField = {
  type: "text",
  name: "icon",
  label: "Icon",
  admin: {
    components: {
      Field: "@/fields/icon/components/icon-picker#IconPicker",
      Cell: "@/fields/icon/components/icon-cell#IconCell",
    },
  },
}

export const iconField = (extensions?: IconFieldExtension): TextField =>
  extensions
    ? mergeWith({}, base, extensions, (a: unknown, b: unknown) =>
        Array.isArray(a) && Array.isArray(b) ? [...a, ...b] : undefined
      )
    : base
