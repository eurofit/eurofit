import { env } from "@/env.mjs"
import { Paystack } from "paystack-sdk"

export const paystack = new Paystack(env.PAYSTACK_SECRET_KEY)
