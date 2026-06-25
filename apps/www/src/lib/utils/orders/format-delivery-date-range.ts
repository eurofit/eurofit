import { APP_TIME_ZONE } from "@/const/time"
import { TZDate } from "@date-fns/tz"
import { format } from "date-fns"

export const formatDeliveryDateRange = (min: Date, max: Date): string => {
  const minTZ = new TZDate(min, APP_TIME_ZONE)
  const maxTZ = new TZDate(max, APP_TIME_ZONE)
  return `${format(minTZ, "EEEE, MMM d")} – ${format(maxTZ, "EEEE, MMM d")}`
}
