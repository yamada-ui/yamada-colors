import { defaultTheme } from "@yamada-ui/react"
import { getColorName } from "utils/color-name-list"
import type { RandomColorOptionsMultiple } from "utils/random-color"
import randomColor from "utils/random-color"

export const getRandomColors = ({
  category,
  count = 10,
  luminosity = "bright",
}: {
  category: string
  count?: RandomColorOptionsMultiple["count"]
  luminosity?: RandomColorOptionsMultiple["luminosity"]
}) => {
  let hue = defaultTheme.colors[category][500]

  if (category === "gray") hue = "monochrome"

  const hexes = randomColor({ count, luminosity, hue })
  const colors = hexes.map((hex) => ({ hex, name: getColorName(hex) }))

  return colors
}
