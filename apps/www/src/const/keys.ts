export const COOKIES_NAMESPACE = "_ef" // ef = eurofit

export const COOKIE_KEYS = {
  GUEST_SESSION_ID: `${COOKIES_NAMESPACE}_g`,
} as const

export const STORAGE_KEYS = {
  RECENT_SEARCHES: `${COOKIES_NAMESPACE}_rs`,
} as const
