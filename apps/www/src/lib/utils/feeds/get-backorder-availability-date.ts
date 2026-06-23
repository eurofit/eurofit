import { addDays, nextThursday } from "date-fns"

const CARGO_SHIP_LAG_DAYS = 1
const TRANSIT_DAYS = 6
const SAFETY_BUFFER_DAYS = 1

const DAYS_FROM_CUTOFF_TO_DELIVERY =
  CARGO_SHIP_LAG_DAYS + TRANSIT_DAYS + SAFETY_BUFFER_DAYS

export function getBackorderAvailabilityDate(fromDate: Date): Date {
  return addDays(nextThursday(fromDate), DAYS_FROM_CUTOFF_TO_DELIVERY)
}
