import nearestColor from "nearest-color"
import colors from "data/colors.json"

export const getColorName = (color: string, fallback: string = "") => {
  const { name } = nearestColor.from(colors)(color) ?? {}

  return name ?? fallback
}
