import { adminOnly } from "@/access/admin"
import { adminOnlyFieldAccess } from "@/access/admin-field"
import { adminOrSelf } from "@/access/admin-or-self"
import { isAdmin } from "@/access/is-admin"
import { site } from "@/const/site"
import { USER_ROLES } from "@/const/user-roles"
import { env } from "@/env.mjs"
import { activeField } from "@/fields/active"
import { User } from "@/payload-types"
import { generateForgotPasswordEmailHTML } from "@eurofit/transactional/forgot-password"
import { generateVerificationEmailHTML } from "@eurofit/transactional/verification"
import { CollectionConfig } from "payload"
import { ensureFirstUserIsAdmin } from "./hooks/ensureFirstUserIsAdmin"
import { preventSuspendedLogin } from "./hooks/prevent-suspended-login"
import { preventDeactivatingLastAdmin } from "./hooks/preventDeactivatingLastAdmin"
import { preventLastAdminDeletion } from "./hooks/preventLastAdminDeletion"
import { preventLastAdminDemotion } from "./hooks/preventLastAdminDemotion"
import { syncToPaystack } from "./hooks/sync-to-paystack"

export const users: CollectionConfig = {
  slug: "users",
  auth: {
    cookies: {
      sameSite: "Lax",
      secure: env.NODE_ENV === "production",
    },
    tokenExpiration: 60 * 60, // 1 hour
    verify: {
      generateEmailHTML({ token, user }) {
        const { firstName } = user as User
        return generateVerificationEmailHTML({
          baseUrl: site.url,
          token,
          firstName,
        })
      },
      generateEmailSubject() {
        return "Verify your email"
      },
    },
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutes in ms
    forgotPassword: {
      generateEmailHTML: ({ user, token } = {}) => {
        const { firstName } = user as User
        return generateForgotPasswordEmailHTML({
          baseUrl: site.url,
          token,
          firstName,
        })
      },
      generateEmailSubject() {
        return "Reset your password"
      },
      expiration: 60 * 60 * 1000, // 1 hour in ms
    },
  },
  access: {
    create: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
    delete: adminOnly,
    admin: isAdmin,
  },
  hooks: {
    beforeLogin: [preventSuspendedLogin],
    beforeChange: [preventLastAdminDemotion, syncToPaystack],
    beforeDelete: [preventLastAdminDeletion],
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "roles", "isActive"],
  },
  disableDuplicate: true,
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
        description:
          "The email address of the user. This will be used for login.",
      },
      saveToJWT: true,
      index: true,
    },
    {
      name: "roles",
      type: "select",
      label: "Roles",
      options: USER_ROLES,
      hasMany: true,
      required: true,
      defaultValue: ["customer"],
      admin: {
        position: "sidebar",
      },
      saveToJWT: true,
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
    },
    activeField({
      saveToJWT: true,
      hooks: {
        beforeChange: [preventDeactivatingLastAdmin],
      },
    }),
    {
      type: "row",
      fields: [
        {
          name: "firstName",
          type: "text",
          label: "First Name",
          required: true,
          saveToJWT: true,
        },
        {
          name: "lastName",
          type: "text",
          label: "Last Name",
          required: true,
          saveToJWT: true,
        },
      ],
    },
    {
      name: "gender",
      type: "select",
      label: "Gender",
      options: [
        {
          value: "male",
          label: "Male",
        },
        {
          value: "female",
          label: "Female",
        },
      ],
      required: true,
    },
    {
      name: "paystackCustomerCode",
      type: "text",
      required: true,
      admin: {
        description:
          "The Paystack customer code for this user. This is given by external payment processor Paystack.",
        readOnly: true,
      },
    },
  ],
}
