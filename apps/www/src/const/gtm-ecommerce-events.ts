/**
 * Recommended GA4 ecommerce event names, modelled as an enum-like constant.
 * Reference them as `GTM_ECOMMERCE_EVENT.PURCHASE` and type event payloads with
 * the derived `GTMEcommerceEventName` union.
 */
export const GTM_ECOMMERCE_EVENT = {
  ADD_PAYMENT_INFO: "add_payment_info",
  ADD_SHIPPING_INFO: "add_shipping_info",
  ADD_TO_CART: "add_to_cart",
  ADD_TO_WISHLIST: "add_to_wishlist",
  BEGIN_CHECKOUT: "begin_checkout",
  INQUIRE_ITEM_PRICE: "inquire_item_price",
  NOTIFY_ME: "notify_me",
  PURCHASE: "purchase",
  REFUND: "refund",
  REMOVE_FROM_CART: "remove_from_cart",
  REMOVE_FROM_WISHLIST: "remove_from_wishlist",
  SELECT_ITEM: "select_item",
  SELECT_PROMOTION: "select_promotion",
  VIEW_CART: "view_cart",
  VIEW_ITEM: "view_item",
  VIEW_ITEM_LIST: "view_item_list",
  VIEW_PROMOTION: "view_promotion",
} as const

export type GTMEcommerceEventName =
  (typeof GTM_ECOMMERCE_EVENT)[keyof typeof GTM_ECOMMERCE_EVENT]

/** ISO 4217 currency for all GA4 ecommerce payloads (Kenyan Shilling). */
export const GTM_ECOMMERCE_CURRENCY = "KES"
