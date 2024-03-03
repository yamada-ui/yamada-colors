import { convertColor } from "@yamada-ui/react"
import blinder from "color-blind"
import convert from "color-convert"
import * as color from "color2k"

export const tones = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

export const isLight = (hex: string) => color.readableColorIsBlack(hex)

export const toRgb = (hex: string) => convert.hex.rgb(hex)

export const toHsl = (hex: string) => convert.hex.hsl(hex)

export const toHsv = (hex: string) => convert.hex.hsv(hex)

export const toCmyk = (hex: string) => convert.hex.cmyk(hex)

export const toCielab = (hex: string) => convert.hex.lab(hex)

export const toCielch = (hex: string) => convert.hex.lch(hex)

export const f = (hex: string, format: ColorFormat = "hex") =>
  convertColor(hex)(format)

export const darken = (hex: string) => {
  const [h, s, l] = toHsl(hex)
  const hexes: string[] = []
  const x = l / 10

  for (let i = 0; i < 10; i++) {
    hexes.push(`#${convert.hsl.hex([h, s, l - x * i]).toLowerCase()}`)
  }

  return hexes
}

export const lighten = (hex: string) => {
  const [h, s, l] = toHsl(hex)
  const hexes: string[] = []
  const x = (100 - l) / 10

  for (let i = 0; i < 10; i++) {
    hexes.push(`#${convert.hsl.hex([h, s, l + x * i]).toLowerCase()}`)
  }

  return hexes
}

export const tone = (hex: string) => {
  const [h, s, l] = toHsl(hex)
  const hexes: string[] = []
  const d = l <= 50
  const x = ((!d ? 100 : 95) - l) / 5
  const y = (l - (d ? 5 : 15)) / 5

  tones.forEach((tone) => {
    const t = tone / 100
    let z: number

    if (t <= 5) {
      z = l + (5 - t) * x
    } else {
      z = l - (t - 5) * y
    }

    hexes.push(`#${convert.hsl.hex([h, s, z]).toLowerCase()}`)
  })

  return hexes
}

export const complementary = (hex: string) => {
  let [h, s, l] = toHsl(hex)

  return [
    `#${convert.hsl.hex([h, s, l]).toLowerCase()}`,
    `#${convert.hsl.hex([h + 180, s, l]).toLowerCase()}`,
  ]
}

export const alternative = (
  hex: string,
  count: number = 10,
  slice: number = 60,
) => {
  let [h, s, l] = toHsl(hex)
  const hexes: string[] = []

  const x = 360 / slice

  for (h = (h - ((x * count) >> 1) + 720) % 360; count--; ) {
    h = (h + x) % 360

    hexes.push(`#${convert.hsl.hex([h, s, l]).toLowerCase()}`)
  }

  return hexes
}

export const hue = (hex: string) => {
  let [h, s, l] = toHsl(hex)
  const hexes: string[] = []

  for (let i = 0; i < 10; i++) {
    const hex = `#${convert.hsl.hex([h + 36 * i, s, l]).toLowerCase()}`

    hexes.push(hex)
  }

  return hexes
}

export const triadic = (hex: string) => {
  let [h, s, l] = toHsl(hex)

  return [
    `#${convert.hsl.hex([h, s, l]).toLowerCase()}`,
    `#${convert.hsl.hex([h + 120, s, l]).toLowerCase()}`,
    `#${convert.hsl.hex([h + 240, s, l]).toLowerCase()}`,
  ]
}

export const square = (hex: string) => {
  let [h, s, l] = toHsl(hex)

  return [
    `#${convert.hsl.hex([h, s, l]).toLowerCase()}`,
    `#${convert.hsl.hex([h + 90, s, l]).toLowerCase()}`,
    `#${convert.hsl.hex([h + 180, s, l]).toLowerCase()}`,
    `#${convert.hsl.hex([h + 270, s, l]).toLowerCase()}`,
  ]
}

export const splitComplementary = (hex: string) => {
  let [h, s, l] = toHsl(hex)

  return [
    `#${convert.hsl.hex([h, s, l]).toLowerCase()}`,
    `#${convert.hsl.hex([h + 150, s, l]).toLowerCase()}`,
    `#${convert.hsl.hex([h - 150, s, l]).toLowerCase()}`,
  ]
}

export const readability = (hex1: string, hex2: string) => {
  return color.getContrast(hex1, hex2)
}

type WcagOptions = {
  level: "AA" | "AAA"
  size: "small" | "large" | "component"
}

export const isReadable = (
  hex1: string,
  hex2: string,
  { level, size }: WcagOptions = { level: "AA", size: "small" },
) => {
  const score = readability(hex1, hex2)

  switch (level + size) {
    case "AAsmall":
    case "AAAlarge":
      return score >= 4.5

    case "AAlarge":
    case "AAcomponent":
    case "AAAcomponent":
      return score >= 3

    case "AAAsmall":
      return score >= 7

    default:
      return false
  }
}

export const mostReadable = (
  hex: string,
  hexes: [string, ...string[]],
  {
    level,
    size,
    includeFallbackColors,
  }: { includeFallbackColors?: boolean } & WcagOptions = {
    level: "AA",
    size: "small",
  },
): string => {
  let result: string
  let bestScore = 0
  let score = 0

  for (var i = 0; i < hexes.length; i++) {
    score = readability(hex, hexes[i])
    if (score > bestScore) {
      bestScore = score

      result = hexes[i]
    }
  }

  if (isReadable(hex, result, { level, size }) || !includeFallbackColors) {
    return result
  } else {
    includeFallbackColors = false

    return mostReadable(hex, ["#fff", "#000"], {
      level,
      size,
      includeFallbackColors,
    })
  }
}

export const blindness = (hex: string) => ({
  original: hex,
  protanopia: blinder.protanopia(hex),
  deuteranopia: blinder.deuteranopia(hex),
  tritanopia: blinder.tritanopia(hex),
  achromatopsia: blinder.achromatopsia(hex),
})
