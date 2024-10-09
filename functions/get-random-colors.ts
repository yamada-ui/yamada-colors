import type { RandomColorOptionsMultiple } from "utils/random-color"
import { defaultTheme } from "@yamada-ui/react"
import { getColorName } from "utils/color-name-list"
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
  let hue = (defaultTheme.colors[category] as { [key: string]: string })[500]

  if (category === "gray") hue = "monochrome"

  const hexes = randomColor({ count, hue, luminosity })
  const colors = hexes.map((hex) => ({ name: getColorName(hex), hex }))

  return colors
}
