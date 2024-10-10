import type { Linter } from "eslint"
import { fixupPluginRules } from "@eslint/compat"
import nextPlugin from "@next/eslint-plugin-next"
import { sharedFiles } from "./shared"

export const nextConfig: Linter.Config = {
  name: "eslint/next",
  files: sharedFiles,
  plugins: {
    "@next/next": fixupPluginRules(nextPlugin),
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs["core-web-vitals"].rules,
    "@next/next/no-assign-module-variable": "off",
    "@next/next/no-title-in-document-head": "off",
  },
}
