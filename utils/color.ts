import convert from "color-convert"
import * as color from "color2k"

export const isLight = (hex: string) => color.readableColorIsBlack(hex)

export const toRgba = (hex: string) => convert.hex.rgb(hex)

export const toHsla = (hex: string) => convert.hex.hsl(hex)

export const toHsva = (hex: string) => convert.hex.hsv(hex)

export const toCmyk = (hex: string) => convert.hex.cmyk(hex)

export const toCielab = (hex: string) => convert.hex.lab(hex)

export const toCielch = (hex: string) => convert.hex.lch(hex)
