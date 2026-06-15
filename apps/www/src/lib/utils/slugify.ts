import slug from "slugify"

export const slugify = (text: string): string => {
  return slug(text, {
    lower: true,
    strict: true,
  })
}
