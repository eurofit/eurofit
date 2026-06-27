export const COOKIES_NAMESPACE = "_ef" // ef = eurofit

export const COOKIE_KEYS = {
  GUEST_SESSION_ID: `${COOKIES_NAMESPACE}_g`,
  CART_MERGE_NOTICE: `${COOKIES_NAMESPACE}_mc`,
} as const

export const STORAGE_KEYS = {
  SEARCHBAR_RECENT_SEARCHES: `${COOKIES_NAMESPACE}_rs`,
} as const
