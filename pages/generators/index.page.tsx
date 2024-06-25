import { noop } from "@yamada-ui/react"
import * as c from "color2k"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { useRef } from "react"
import { Header } from "./header"
import { Hexes } from "./hexes"
import { Tabs } from "./tabs"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { alternative, darken, hue, lighten, tone } from "utils/color"
import { getServerSideCommonProps } from "utils/next"

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

export const getServerSideProps = async (req: GetServerSidePropsContext) => {
  const {
    props: { cookies, format, palettes },
  } = await getServerSideCommonProps(req)
  let tab = (req.query.tab ?? "alternatives") as string
  let hex = `#${req.query.hex}`

  try {
    hex = c.toHex(hex)

    const hexes = getHexes(tab, hex)

    const props = {
      cookies,
      format,
      palettes,
      tab,
      hex,
      hexes,
    }

    return { props }
  } catch {
    return { notFound: true }
  }
}

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({ tab, hex, format, palettes, hexes }) => {
  const onSelectRef = useRef<(tab: string, hex: string) => void>(noop)
  const { t } = useI18n()

  return (
    <AppLayout
      title={t("generators.title")}
      description={t("generators.description")}
      hex={hex}
      format={format}
      palettes={palettes}
      gap={{ base: "lg", sm: "normal" }}
    >
      <Header {...{ hex, tab }} />

      <Tabs {...{ tab, hex, onSelectRef }} />

      <Hexes {...{ hexes, hex, onSelectRef }} />
    </AppLayout>
  )
}

export default Page
