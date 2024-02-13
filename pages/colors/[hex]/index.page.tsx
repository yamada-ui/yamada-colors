import * as c from "color2k"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { Data } from "./data"
import { Gradient } from "./gradient"
import { Header } from "./header"
import { useHistory } from "./use-history"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import {
  darken,
  tone,
  lighten,
  toCielab,
  toCielch,
  toCmyk,
  toHsl,
  toHsv,
  toRgb,
} from "utils/color"
import { getColorName } from "utils/color-name-list"
import { getServerSideCommonProps } from "utils/next"

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

export type ColorData = PageProps["data"]

const Page: NextPage<PageProps> = ({
  cookies,
  hex,
  name,
  data,
  shadeColors,
  tintColors,
  toneColors,
}) => {
  useHistory({ cookies, hex })
  const { t } = useI18n()

  return (
    <AppLayout title={hex} description={t("colors.description")} gap="lg">
      <Header {...{ hex, name }} />
      <Data {...data} />
      <Gradient {...{ hex, shadeColors, tintColors, toneColors }} />
    </AppLayout>
  )
}

export default Page

const getColorData = (hex: string) => {
  const name = getColorName(hex)
  const rgb = toRgb(hex)
  const hsl = toHsl(hex)
  const hsv = toHsv(hex)
  const cmyk = toCmyk(hex)
  const cielab = toCielab(hex)
  const cielch = toCielch(hex)

  return { name, hex, rgb, hsl, hsv, cmyk, cielab, cielch }
}

const getShadeColors = (hex: string) => {
  const hexes = darken(hex)

  const colors = hexes.map((hex) => ({ hex, name: getColorName(hex) }))

  return colors
}

const getTintColors = (hex: string) => {
  const hexes = lighten(hex)

  const colors = hexes.map((hex) => ({ hex, name: getColorName(hex) }))

  return colors
}

const getToneColors = (hex: string) => {
  const hexes = tone(hex)

  const colors = hexes.map((hex) => ({ hex, name: getColorName(hex) }))

  return colors
}

export const getServerSideProps = async (req: GetServerSidePropsContext) => {
  const {
    props: { cookies },
  } = await getServerSideCommonProps(req)
  let hex = `#${req.query.hex}` as string

  try {
    hex = c.toHex(hex)

    const data = getColorData(hex)

    const { name } = data

    const shadeColors = getShadeColors(hex)
    const tintColors = getTintColors(hex)
    const toneColors = getToneColors(hex)

    const props = {
      cookies,
      name,
      hex,
      data,
      shadeColors,
      tintColors,
      toneColors,
    }

    return { props }
  } catch {
    return { notFound: true }
  }
}
