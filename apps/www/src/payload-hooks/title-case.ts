import { FieldHook } from "payload"
import { titleCase as titleCaseFn } from "title-case"

export const titleCase: FieldHook = ({ value }) => {
  return titleCaseFn(value)
}
