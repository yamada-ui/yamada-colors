interface Color {
  name: string
  hex: string
}
type Colors = Color[]

interface PaletteColor {
  name: string
  hex: [string, string]
}
type PaletteColors = PaletteColor[]

interface ReorderColor extends PaletteColor {
  id: string
}
type ReorderColors = ReorderColor[]

interface ColorPalette {
  name: string
  colors: PaletteColors
  timestamp: number
  uuid: string
}
type ColorPalettes = ColorPalette[]

type ColorExport = "css" | "css.token" | "json" | "json.token"

type ColorFormat = "hex" | "hsl" | "rgb"

type ColorContrastLevel = "aa" | "aaa"

type ColorContrastGround = "bg" | "fg"

interface ColorContrastLevelScore {
  component: boolean
  large: boolean
  small: boolean
}

interface ColorContrastScore {
  aa: ColorContrastLevelScore
  aaa: ColorContrastLevelScore
  score: number
}

interface ColorContrastSource {
  bg: string
  fg: string
}

interface ColorContrast extends ColorContrastScore, ColorContrastSource {}
