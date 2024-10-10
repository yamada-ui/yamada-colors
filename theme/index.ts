import type { UsageTheme } from "@yamada-ui/react"
import { extendConfig, extendTheme } from "@yamada-ui/react"
import { components } from "./components"
import { customConfig } from "./config"
import { semantics } from "./semantics"
import { globalStyle } from "./styles"
import { tokens } from "./tokens"

export const customTheme: UsageTheme = {
  components,
  semantics,
  styles: { globalStyle },
  ...tokens,
}

export const theme = extendTheme(customTheme)()

export const config = extendConfig(customConfig)

export default theme
