import { NumberFieldSingleValidation } from "payload"

export const validateQty: NumberFieldSingleValidation = (value) =>
  (!!value && value > 0) || "Qty is required"
