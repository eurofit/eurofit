export type FilterItem = {
  slug: string
  title: string
  count: number
}

export type FilterGroup = {
  key: string
  title: string
  items: FilterItem[]
}
