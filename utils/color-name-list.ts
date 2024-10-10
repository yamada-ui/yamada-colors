import colors from "data/colors.json"
import nearestColor from "nearest-color"

const matcher = nearestColor.from(colors)

export const getColorName = (color: string, fallback = "") => {
  const { name } = matcher(color) ?? {}

  return name ?? fallback
}
