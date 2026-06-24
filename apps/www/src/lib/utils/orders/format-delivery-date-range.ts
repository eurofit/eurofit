import { APP_TIME_ZONE } from "@/const/time"
import { formatDateRange } from "little-date"

export const formatDeliveryDateRange = (min: Date, max: Date): string =>
  formatDateRange(min, max, { timezone: APP_TIME_ZONE })
