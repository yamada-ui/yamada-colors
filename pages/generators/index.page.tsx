import * as c from "color2k"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { Header } from "./header"
import { Hexes } from "./hexes"
import { Tabs } from "./tabs"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { alternative, darken, hue, lighten, tone } from "utils/color"
import { getServerSideCommonProps } from "utils/next"

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({ tab, hex, format, hexes }) => {
  const { t } = useI18n()

  return (
    <AppLayout
      title={t("generators.title")}
      description={t("generators.description")}
      hex={hex}
      format={format}
      gap={{ base: "lg", sm: "normal" }}
    >
      <Header {...{ hex, tab }} />

      <Tabs {...{ tab, hex }} />

      <Hexes {...{ hexes }} />
    </AppLayout>
  )
}

export default Page

const getTabData = (hex: string, tab: string) => {
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
    props: { cookies, format },
  } = await getServerSideCommonProps(req)
  let hex = `#${req.query.hex}`
  let tab = (req.query.tab ?? "alternatives") as string

  try {
    hex = c.toHex(hex)

    const hexes = getTabData(hex, tab)

    const props = {
      cookies,
      format,
      tab,
      hex,
      hexes,
    }

    return { props }
  } catch {
    return { notFound: true }
  }
}
