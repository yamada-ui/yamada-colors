import type { UsageTheme, ThemeSchemes } from "@yamada-ui/react"
import { extendConfig, extendTheme } from "@yamada-ui/react"
import { components } from "./components"
import { customConfig } from "./config"
import { semantics } from "./semantics"
import { globalStyle } from "./styles"
import { tokens } from "./tokens"

const colorSchemes = [
  "gray",
  "neutral",
  "red",
  "rose",
  "pink",
  "flashy",
  "fuchsia",
  "purple",
  "violet",
  "indigo",
  "blue",
  "sky",
  "cyan",
  "teal",
  "emerald",
  "green",
  "lime",
  "yellow",
  "amber",
  "orange",
]

export const customTheme: UsageTheme = {
  styles: { globalStyle },
  semantics,
  components,
  themeSchemes: colorSchemes.reduce(
    (prev, colorScheme) => ({
      ...prev,
      [colorScheme]: {
        semantics: {
          colors: { primary: `${colorScheme}.500` },
          colorSchemes: { primary: colorScheme },
        },
      },
    }),
    {} as ThemeSchemes,
  ),
  colorSchemes,
  ...tokens,
}

export const theme = extendTheme(customTheme)()

export const config = extendConfig(customConfig)

export default theme
