import convert from "color-convert"
import * as color from "color2k"

export const tones = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95]

export const isLight = (hex: string) => color.readableColorIsBlack(hex)

export const toRgb = (hex: string) => convert.hex.rgb(hex)

export const toHsl = (hex: string) => convert.hex.hsl(hex)

export const toHsv = (hex: string) => convert.hex.hsv(hex)

export const toCmyk = (hex: string) => convert.hex.cmyk(hex)

export const toCielab = (hex: string) => convert.hex.lab(hex)

export const toCielch = (hex: string) => convert.hex.lch(hex)

export const darken = (hex: string) => {
  const [h, s, l] = toHsl(hex)
  const hexes: string[] = []
  const x = l / 10

  for (let i = 0; i < 10; i++) {
    const ll = l - x * i

    const hex = `#${convert.hsl.hex([h, s, ll]).toLowerCase()}`

    hexes.push(hex)
  }

  return hexes
}

export const lighten = (hex: string) => {
  const [h, s, l] = toHsl(hex)
  const hexes: string[] = []
  const x = (100 - l) / 10

  for (let i = 0; i < 10; i++) {
    const ll = l + x * i

    const hex = `#${convert.hsl.hex([h, s, ll]).toLowerCase()}`

    hexes.push(hex)
  }

  return hexes
}

export const tone = (hex: string) => {
  const [h, s] = toHsl(hex)

  const hexes: string[] = tones.map((l) => {
    l = 100 - l

    const hex = `#${convert.hsl.hex([h, s, l]).toLowerCase()}`

    return hex
  })

  return hexes
}
