import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { noop } from "@yamada-ui/react"
import * as c from "color2k"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { useRef } from "react"
import { alternative, darken, hue, lighten, tone } from "utils/color"
import { getColorName } from "utils/color-name-list"
import { getServerSideCommonProps } from "utils/next"
import { Header } from "./header"
import { Hexes } from "./hexes"
import { Tabs } from "./tabs"

export const getHexes = (tab: string, hex: string) => {
  switch (tab) {
    case "alternatives":
      return alternative(hex)

    case "shades":
      return darken(hex)

    case "tints":
      return lighten(hex)

    case "tones":
      return tone(hex)

    case "hues":
      return hue(hex)

    default:
      return []
  }
}

export const getServerSideProps = (req: GetServerSidePropsContext) => {
  const {
    props: { cookies, format, palettes },
  } = getServerSideCommonProps(req)
  let tab = (req.query.tab ?? "alternatives") as string
  let hex = `#${req.query.hex}`

  try {
    hex = c.toHex(hex)

    const hexes = getHexes(tab, hex).map((hex) => ({
      name: getColorName(hex),
      hex,
    }))

    const props = {
      cookies,
      format,
      hex,
      hexes,
      palettes,
      tab,
    }

    return { props }
  } catch {
    return { notFound: true }
  }
}

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({ format, hex, hexes, palettes, tab }) => {
  const onSelectRef = useRef<(tab: string, hex: string) => void>(noop)
  const { t } = useI18n()

  return (
    <AppLayout
      description={t("generators.description")}
      format={format}
      gap={{ base: "lg", sm: "normal" }}
      hex={hex}
      nofollow
      noindex
      palettes={palettes}
      title={t("generators.title")}
    >
      <Header {...{ hex, tab }} />

      <Tabs {...{ hex, tab, onSelectRef }} />

      <Hexes {...{ hex, hexes, onSelectRef }} />
    </AppLayout>
  )
}

export default Page
