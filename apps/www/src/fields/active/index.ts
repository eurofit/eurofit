import { mergeWith } from "lodash-es"
import type { CheckboxField } from "payload"

import { adminOnlyFieldAccess } from "@/access/admin-field"

type ActiveFieldExtension = Omit<Partial<CheckboxField>, "type">

const base: CheckboxField = {
  type: "checkbox",
  name: "isActive",
  label: "Active",
  required: true,
  defaultValue: true,
  admin: {
    position: "sidebar",
    components: {
      Cell: "/fields/active/components/active-cell",
    },
  },
  access: {
    create: adminOnlyFieldAccess,
    read: adminOnlyFieldAccess,
    update: adminOnlyFieldAccess,
  },
}

export const activeField = (
  extensions?: ActiveFieldExtension
): CheckboxField =>
  extensions
    ? mergeWith({}, base, extensions, (a: unknown, b: unknown) =>
        Array.isArray(a) && Array.isArray(b) ? [...a, ...b] : undefined
      )
    : base
