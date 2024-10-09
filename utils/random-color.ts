/* eslint-disable no-var */
export interface RandomColorOptionsSingle {
  alpha?: number
  format?: "hex" | "hsl" | "hsla" | "rgb" | "rgba"
  hue?: number | string
  luminosity?: "bright" | "dark" | "light" | "random"
  seed?: number | string
}

export interface RandomColorOptionsMultiple extends RandomColorOptionsSingle {
  count: number
}

export interface RandomColorDictionary {
  [key: string]: {
    brightnessRange: [number, number]
    hueRange: [number, number] | null
    lowerBounds: [number, number][]
    saturationRange: [number, number]
  }
}

let seed: null | number | string = null

const colorDictionary: RandomColorDictionary = {}

loadColorBounds()

const colorRanges: boolean[] = []

function randomColor<
  T extends RandomColorOptionsMultiple | RandomColorOptionsSingle,
>(options: T): T extends RandomColorOptionsMultiple ? string[] : string {
  if (
    options.seed != null &&
    options.seed === parseInt(options.seed.toString(), 10)
  ) {
    seed = options.seed
  } else if (typeof options.seed === "string") {
    seed = stringToInteger(options.seed)
  } else if (options.seed != null) {
    throw new TypeError("The seed value must be an integer or string")
  } else {
    seed = null
  }

  let H: number, S: number, B: number

  if ("count" in options) {
    let totalColors = options.count,
      colors: string[] = []
    for (let i = 0; i < options.count; i++) {
      colorRanges.push(false)
    }
    // @ts-ignore
    delete options.count

    while (totalColors > colors.length) {
      let color = randomColor(options) as string

      if (seed !== null) {
        options.seed = seed
      }

      colors.push(color)
    }

    options.count = totalColors

    // @ts-ignore
    return colors
  }

  H = pickHue(options)

  S = pickSaturation(H, options)

  B = pickBrightness(H, S, options)

  // @ts-ignore
  return setFormat([H, S, B], options)
}

function pickHue(options: RandomColorOptionsSingle) {
  if (colorRanges.length > 0) {
    var hueRange = getRealHueRange(options.hue)

    var hue = randomWithin(hueRange)

    if (!hueRange) return hue

    let step = (hueRange[1] - hueRange[0]) / colorRanges.length

    let j = parseInt(((hue - hueRange[0]) / step).toString())

    if (colorRanges[j] === true) {
      j = (j + 2) % colorRanges.length
    } else {
      colorRanges[j] = true
    }

    let min = (hueRange[0] + j * step) % 359,
      max = (hueRange[0] + (j + 1) * step) % 359

    hueRange = [min, max]

    hue = randomWithin(hueRange)

    if (hue < 0) {
      hue = 360 + hue
    }
    return hue
  } else {
    var hueRange = getHueRange(options.hue)

    hue = randomWithin(hueRange)
    if (hue < 0) {
      hue = 360 + hue
    }

    return hue
  }
}

function pickSaturation(hue: number, options: RandomColorOptionsSingle) {
  if (options.hue === "monochrome") {
    return 0
  }

  if (options.luminosity === "random") {
    return randomWithin([0, 100])
  }

  let saturationRange = getSaturationRange(hue)

  let sMin = saturationRange?.[0] ?? 0,
    sMax = saturationRange?.[1] ?? 0

  switch (options.luminosity) {
    case "bright":
      sMin = 55
      break

    case "dark":
      sMin = sMax - 10
      break

    case "light":
      sMax = 55
      break
  }

  return randomWithin([sMin, sMax])
}

function pickBrightness(
  H: number,
  S: number,
  options: RandomColorOptionsSingle,
) {
  let bMin = getMinimumBrightness(H, S),
    bMax = 100

  switch (options.luminosity) {
    case "dark":
      bMax = bMin + 20
      break

    case "light":
      bMin = (bMax + bMin) / 2
      break

    case "random":
      bMin = 0
      bMax = 100
      break
  }

  return randomWithin([bMin, bMax])
}

function setFormat(
  hsv: [number, number, number],
  options: RandomColorOptionsSingle,
) {
  switch (options.format) {
    case "hsl":
      var hsl = HSVtoHSL(hsv)
      return "hsl(" + hsl[0] + ", " + hsl[1] + "%, " + hsl[2] + "%)"

    case "hsla":
      var hslColor = HSVtoHSL(hsv)
      var alpha = options.alpha || Math.random()
      return (
        "hsla(" +
        hslColor[0] +
        ", " +
        hslColor[1] +
        "%, " +
        hslColor[2] +
        "%, " +
        alpha +
        ")"
      )

    case "rgb":
      var rgb = HSVtoRGB(hsv)
      return "rgb(" + rgb.join(", ") + ")"

    case "rgba":
      var rgbColor = HSVtoRGB(hsv)
      var alpha = options.alpha || Math.random()
      return "rgba(" + rgbColor.join(", ") + ", " + alpha + ")"

    default:
      return HSVtoHex(hsv)
  }
}

function getMinimumBrightness(H: number, S: number) {
  let lowerBounds = getColorInfo(H)?.lowerBounds ?? []

  for (let i = 0; i < lowerBounds.length - 1; i++) {
    let s1 = lowerBounds[i]![0],
      v1 = lowerBounds[i]![1]

    let s2 = lowerBounds[i + 1]![0],
      v2 = lowerBounds[i + 1]![1]

    if (S >= s1 && S <= s2) {
      let m = (v2 - v1) / (s2 - s1),
        b = v1 - m * s1

      return m * S + b
    }
  }

  return 0
}

function getHueRange(
  colorInput: number | string | undefined,
): [number, number] | null | undefined {
  if (typeof parseInt(colorInput?.toString() ?? "0") === "number") {
    let number = parseInt(colorInput?.toString() ?? "0")

    if (number < 360 && number > 0) {
      return [number, number]
    }
  }

  if (typeof colorInput === "string") {
    if (colorDictionary[colorInput]) {
      let color = colorDictionary[colorInput]
      if (color.hueRange) {
        return color.hueRange
      }
    } else if (colorInput.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
      let hue = HexToHSB(colorInput)?.[0]

      return typeof hue === "number" ? [hue, hue] : null
    }
  }

  return [0, 360]
}

function getSaturationRange(hue: number) {
  return getColorInfo(hue)?.saturationRange
}

function getColorInfo(hue: number | undefined = 0) {
  if (hue >= 334 && hue <= 360) {
    hue -= 360
  }

  for (let colorName in colorDictionary) {
    let color = colorDictionary[colorName]

    if (
      color?.hueRange &&
      hue >= color.hueRange[0] &&
      hue <= color.hueRange[1]
    ) {
      return colorDictionary[colorName]
    }
  }
}

function randomWithin(range: [number, number] | null | undefined) {
  if (seed === null) {
    if (!range) return 0
    let golden_ratio = 0.618033988749895
    let r = Math.random()
    r += golden_ratio
    r %= 1
    return Math.floor(range[0] + r * (range[1] + 1 - range[0]))
  } else {
    let max = range?.[1] || 1
    let min = range?.[0] || 0
    seed = (Number(seed) * 9301 + 49297) % 233280
    let rnd = seed / 233280.0
    return Math.floor(min + rnd * (max - min))
  }
}

function HSVtoHex(hsv: [number, number, number]) {
  let rgb = HSVtoRGB(hsv)

  function componentToHex(c: number) {
    let hex = c.toString(16)
    return hex.length == 1 ? "0" + hex : hex
  }

  let hex =
    "#" +
    componentToHex(rgb[0]!) +
    componentToHex(rgb[1]!) +
    componentToHex(rgb[2]!)

  return hex
}

function defineColor(
  name: string,
  hueRange: [number, number] | null,
  lowerBounds: [number, number][],
) {
  let sMin = lowerBounds[0]![0],
    sMax = lowerBounds[lowerBounds.length - 1]![0],
    bMin = lowerBounds[lowerBounds.length - 1]![1],
    bMax = lowerBounds[0]![1]

  colorDictionary[name] = {
    brightnessRange: [bMin, bMax],
    hueRange: hueRange,
    lowerBounds: lowerBounds,
    saturationRange: [sMin, sMax],
  }
}

function loadColorBounds() {
  defineColor("monochrome", null, [
    [0, 0],
    [100, 0],
  ])

  defineColor(
    "red",
    [-26, 18],
    [
      [20, 100],
      [30, 92],
      [40, 89],
      [50, 85],
      [60, 78],
      [70, 70],
      [80, 60],
      [90, 55],
      [100, 50],
    ],
  )

  defineColor(
    "orange",
    [18, 46],
    [
      [20, 100],
      [30, 93],
      [40, 88],
      [50, 86],
      [60, 85],
      [70, 70],
      [100, 70],
    ],
  )

  defineColor(
    "yellow",
    [46, 62],
    [
      [25, 100],
      [40, 94],
      [50, 89],
      [60, 86],
      [70, 84],
      [80, 82],
      [90, 80],
      [100, 75],
    ],
  )

  defineColor(
    "green",
    [62, 178],
    [
      [30, 100],
      [40, 90],
      [50, 85],
      [60, 81],
      [70, 74],
      [80, 64],
      [90, 50],
      [100, 40],
    ],
  )

  defineColor(
    "blue",
    [178, 257],
    [
      [20, 100],
      [30, 86],
      [40, 80],
      [50, 74],
      [60, 60],
      [70, 52],
      [80, 44],
      [90, 39],
      [100, 35],
    ],
  )

  defineColor(
    "purple",
    [257, 282],
    [
      [20, 100],
      [30, 87],
      [40, 79],
      [50, 70],
      [60, 65],
      [70, 59],
      [80, 52],
      [90, 45],
      [100, 42],
    ],
  )

  defineColor(
    "pink",
    [282, 334],
    [
      [20, 100],
      [30, 90],
      [40, 86],
      [60, 84],
      [80, 80],
      [90, 75],
      [100, 73],
    ],
  )
}

function HSVtoRGB(hsv: [number, number, number]) {
  let h = hsv[0]
  if (h === 0) {
    h = 1
  }
  if (h === 360) {
    h = 359
  }

  // Rebase the h,s,v values
  h = h / 360
  let s = hsv[1] / 100,
    v = hsv[2] / 100

  let h_i = Math.floor(h * 6),
    f = h * 6 - h_i,
    p = v * (1 - s),
    q = v * (1 - f * s),
    t = v * (1 - (1 - f) * s),
    r = 256,
    g = 256,
    b = 256

  switch (h_i) {
    case 0:
      r = v
      g = t
      b = p
      break
    case 1:
      r = q
      g = v
      b = p
      break
    case 2:
      r = p
      g = v
      b = t
      break
    case 3:
      r = p
      g = q
      b = v
      break
    case 4:
      r = t
      g = p
      b = v
      break
    case 5:
      r = v
      g = p
      b = q
      break
  }

  let result = [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)]
  return result
}

function HexToHSB(hex: string) {
  hex = hex.replace(/^#/, "")
  hex = hex.length === 3 ? hex.replace(/(.)/g, "$1$1") : hex

  let red = parseInt(hex.substr(0, 2), 16) / 255,
    green = parseInt(hex.substr(2, 2), 16) / 255,
    blue = parseInt(hex.substr(4, 2), 16) / 255

  let cMax = Math.max(red, green, blue),
    delta = cMax - Math.min(red, green, blue),
    saturation = cMax ? delta / cMax : 0

  switch (cMax) {
    case red:
      return [60 * (((green - blue) / delta) % 6) || 0, saturation, cMax]
    case green:
      return [60 * ((blue - red) / delta + 2) || 0, saturation, cMax]
    case blue:
      return [60 * ((red - green) / delta + 4) || 0, saturation, cMax]
  }
}

function HSVtoHSL(hsv: [number, number, number]) {
  let h = hsv[0],
    s = hsv[1] / 100,
    v = hsv[2] / 100,
    k = (2 - s) * v

  return [
    h,
    Math.round(((s * v) / (k < 1 ? k : 2 - k)) * 10000) / 100,
    (k / 2) * 100,
  ]
}

function stringToInteger(string: string) {
  let total = 0
  for (let i = 0; i !== string.length; i++) {
    if (total >= Number.MAX_SAFE_INTEGER) break
    total += string.charCodeAt(i)
  }
  return total
}

function getRealHueRange(
  colorHue: number | string | undefined,
): [number, number] | null | undefined {
  if (!isNaN(Number(colorHue))) {
    let number = parseInt(colorHue?.toString() ?? "0")

    if (number < 360 && number > 0) {
      return getColorInfo(number)?.hueRange
    }
  } else if (typeof colorHue === "string") {
    if (colorDictionary[colorHue]) {
      let color = colorDictionary[colorHue]

      if (color.hueRange) {
        return color.hueRange
      }
    } else if (colorHue.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
      let hue = HexToHSB(colorHue)?.[0]
      return getColorInfo(hue)?.hueRange
    }
  }

  return [0, 360]
}

export default randomColor
