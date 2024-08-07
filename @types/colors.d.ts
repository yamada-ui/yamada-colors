type Color = { hex: string; name: string }
type Colors = Color[]

type PaletteColor = { hex: [string, string]; name: string }
type PaletteColors = PaletteColor[]

type ReorderColor = PaletteColor & { id: string }
type ReorderColors = ReorderColor[]

type ColorPalette = {
  uuid: string
  name: string
  colors: PaletteColors
  timestamp: number
}
type ColorPalettes = ColorPalette[]

type ColorExport = "json" | "json.token" | "css" | "css.token"

type ColorFormat = "hex" | "rgb" | "hsl"

type ColorContrastLevel = "aa" | "aaa"

type ColorContrastGround = "fg" | "bg"

type ColorContrastLevelScore = {
  small: boolean
  large: boolean
  component: boolean
}

type ColorContrastScore = {
  score: number
} & Record<ColorContrastLevel, ColorContrastLevelScore>

type ColorContrastSource = {
  fg: string
  bg: string
}

type ColorContrast = ColorContrastSource & ColorContrastScore
