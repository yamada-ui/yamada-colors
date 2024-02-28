type Color = { hex: string; name: string }
type Colors = Color[]
type ColorPalette = {
  uuid: string
  name: string
  colors: Colors
  timestamp: number
}
type ColorPalettes = ColorPalette[]
