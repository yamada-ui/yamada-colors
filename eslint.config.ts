import type { TSESLint } from "@typescript-eslint/utils"
import type { Linter } from "eslint"
import prettierConfig from "eslint-config-prettier"
import globals from "globals"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import tseslint from "typescript-eslint"
import {
  baseConfig,
  cspellConfig,
  importConfigArray,
  jsxA11yConfig,
  nextConfig,
  perfectionistConfig,
  reactConfig,
  reactHooksConfig,
  sharedFiles,
  typescriptConfig,
} from "./.eslint"

const ignoresConfig: Linter.Config = {
  name: "eslint/ignores",
  ignores: ["**/.next/**", "**/node_modules/**", "**/pnpm-lock.yaml"],
}

const tsConfigPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "./tsconfig.json",
)

const languageOptionConfig: TSESLint.FlatConfig.Config = {
  name: "eslint/language-options",
  files: sharedFiles,
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.es2015,
    },
    parser: tseslint.parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 10,
      project: tsConfigPath,
      sourceType: "module",
    },
  },
}

export default tseslint.config(
  ignoresConfig,
  languageOptionConfig,
  baseConfig,
  typescriptConfig,
  ...importConfigArray,
  cspellConfig,
  perfectionistConfig,
  reactConfig,
  reactHooksConfig,
  nextConfig,
  jsxA11yConfig,
  prettierConfig,
)
