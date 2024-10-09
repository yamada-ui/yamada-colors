import { convertColor, generate } from "@yamada-ui/react"
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

export const f = (hex: string | undefined, format: ColorFormat = "hex") =>
  convertColor(hex ?? "#ffffff")(format)!

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

export const tone = (hex: string) =>
  Object.values(generate.tones(hex)) as string[]

export const complementary = (hex: string) => {
  let [h, s, l] = toHsl(hex)

  return [
    `#${convert.hsl.hex([h, s, l]).toLowerCase()}`,
    `#${convert.hsl.hex([h + 180, s, l]).toLowerCase()}`,
  ]
}

export const alternative = (hex: string, count = 10, slice = 60) => {
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

interface WcagOptions {
  size: "component" | "large" | "small"
  level: "AA" | "AAA"
}

export const isReadable = (
  hex1: string,
  hex2: string,
  { size, level }: WcagOptions = { size: "small", level: "AA" },
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
  targetHex: string,
  hexes: [string, ...string[]],
  {
    size,
    includeFallbackColors,
    level,
  }: { includeFallbackColors?: boolean } & WcagOptions = {
    size: "small",
    level: "AA",
  },
): string => {
  let result: string | undefined = undefined
  let bestScore = 0
  let score = 0

  for (const hex of hexes) {
    score = readability(targetHex, hex)

    if (score > bestScore) {
      bestScore = score

      result = hex
    }
  }

  if (
    isReadable(targetHex, result!, { size, level }) ||
    !includeFallbackColors
  ) {
    return result!
  } else {
    includeFallbackColors = false

    return mostReadable(targetHex, ["#fff", "#000"], {
      size,
      includeFallbackColors,
      level,
    })
  }
}

export const blindness = (hex: string) => ({
  achromatopsia: blinder.achromatopsia(hex),
  deuteranopia: blinder.deuteranopia(hex),
  original: hex,
  protanopia: blinder.protanopia(hex),
  tritanopia: blinder.tritanopia(hex),
})
