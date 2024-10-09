import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { defaultTheme } from "@yamada-ui/react"
import * as c from "color2k"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import {
  alternative,
  blindness,
  complementary,
  darken,
  hue,
  isReadable,
  lighten,
  readability,
  splitComplementary,
  square,
  toCielab,
  toCielch,
  toCmyk,
  toHsl,
  toHsv,
  tone,
  toRgb,
  triadic,
} from "utils/color"
import { getColorName } from "utils/color-name-list"
import { getServerSideCommonProps } from "utils/next"
import { A11y } from "./a11y"
import { Data } from "./data"
import { Gradients } from "./gradients"
import { Header } from "./header"
import { Others } from "./others"
import { useHistory } from "./use-history"

const getColorData = (hex: string) => {
  const name = getColorName(hex)
  const rgb = toRgb(hex)
  const hsl = toHsl(hex)
  const hsv = toHsv(hex)
  const cmyk = toCmyk(hex)
  const cielab = toCielab(hex)
  const cielch = toCielch(hex)

  return { name, cielab, cielch, cmyk, hex, hsl, hsv, rgb }
}

export type ColorData = ReturnType<typeof getColorData>

const getShadeColors = (hex: string) => {
  const hexes = darken(hex)

  const colors = hexes.map((hex) => ({ name: getColorName(hex), hex }))

  return colors
}

const getTintColors = (hex: string) => {
  const hexes = lighten(hex)

  const colors = hexes.map((hex) => ({ name: getColorName(hex), hex }))

  return colors
}

const getToneColors = (hex: string) => {
  const hexes = tone(hex)

  const colors = hexes.map((hex) => ({ name: getColorName(hex), hex }))

  return colors
}

const getContrast = (hex: string) => {
  const white = defaultTheme.colors.white as string
  const black = defaultTheme.colors.black as string

  return {
    light: {
      large: isReadable(hex, white, { size: "large", level: "AA" }),
      score: readability(hex, white),
      small: isReadable(hex, white, { size: "small", level: "AA" }),
    },
    dark: {
      large: isReadable(hex, black, { size: "large", level: "AA" }),
      score: readability(hex, black),
      small: isReadable(hex, black, { size: "small", level: "AA" }),
    },
  }
}

export const getServerSideProps = (req: GetServerSidePropsContext) => {
  const {
    props: { cookies, format, palettes },
  } = getServerSideCommonProps(req)

  let hex = `#${req.query.hex}`

  try {
    hex = c.toHex(hex)

    const data = getColorData(hex)

    const { name } = data

    const shadeColors = getShadeColors(hex)
    const tintColors = getTintColors(hex)
    const toneColors = getToneColors(hex)
    const complementaryColors = complementary(hex)
    const hueColors = hue(hex)
    const alternativeColors = alternative(hex)
    const triadicColors = triadic(hex)
    const squareColors = square(hex)
    const splitComplementaryColors = splitComplementary(hex)
    const blind = blindness(hex)
    const contrast = getContrast(hex)

    const props = {
      name,
      alternativeColors,
      blind,
      complementaryColors,
      contrast,
      cookies,
      data,
      format,
      hex,
      hueColors,
      palettes,
      shadeColors,
      splitComplementaryColors,
      squareColors,
      tintColors,
      toneColors,
      triadicColors,
    }

    return { props }
  } catch {
    return { notFound: true }
  }
}

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({
  name,
  alternativeColors,
  blind,
  complementaryColors,
  contrast,
  cookies,
  data,
  format,
  hex,
  hueColors,
  palettes,
  shadeColors,
  splitComplementaryColors,
  squareColors,
  tintColors,
  toneColors,
  triadicColors,
}) => {
  useHistory({ cookies, hex })
  const { t } = useI18n()

  return (
    <AppLayout
      description={t("colors.description")}
      format={format}
      gap={{ base: "lg", sm: "normal" }}
      hex={hex}
      nofollow
      noindex
      palettes={palettes}
      title={hex}
    >
      <Header {...{ name, hex }} />

      <Data {...data} />

      <Gradients {...{ hex, shadeColors, tintColors, toneColors }} />

      <A11y {...{ blind, contrast, hex }} />

      <Others
        {...{
          alternativeColors,
          complementaryColors,
          hex,
          hueColors,
          splitComplementaryColors,
          squareColors,
          triadicColors,
        }}
      />
    </AppLayout>
  )
}

export default Page
