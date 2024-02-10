import nearestColor from "nearest-color"
import colors from "data/colors.json"

const matcher = nearestColor.from(colors)

export const getColorName = (color: string, fallback: string = "") => {
  const { name } = matcher(color) ?? {}

  return name ?? fallback
}
