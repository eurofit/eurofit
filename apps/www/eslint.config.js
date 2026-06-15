import { nextJsConfig } from "@eurofit/eslint-config/next-js"

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    ignores: [
      "src/payload-types.ts",
      "src/payload-generated-schema.ts",
      "src/app/(payload)/**",
    ],
  },
]
