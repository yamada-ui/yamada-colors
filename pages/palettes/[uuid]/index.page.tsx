import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { useMemo, useState } from "react"
import { PaletteProvider } from "./context"
import { Header } from "./header"
import { Hexes } from "./hexes"
import { CONSTANT } from "constant"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { getServerSideCommonProps } from "utils/next"
import { generateUUID, getCookie } from "utils/storage"

export type OrderColor = Color & { id: string }
export type OrderColors = OrderColor[]

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({
  hex,
  format,
  palettes,
  palette,
  tab: tabProp,
}) => {
  const { t } = useI18n()
  const [name, setName] = useState<string>(palette.name)
  const [colors, setColors] = useState<OrderColors>(
    palette.colors.map((color) => ({ id: generateUUID(), ...color })),
  )
  const [tab, setTab] = useState<string>(tabProp)
  const { uuid, timestamp } = palette

  const value = useMemo(
    () => ({ tab, uuid, name, colors, timestamp, setTab, setName, setColors }),
    [tab, uuid, colors, name, timestamp],
  )

  return (
    <AppLayout
      title={palette.name}
      description={t("palettes.description")}
      hex={hex}
      format={format}
      palettes={palettes}
      gap={{ base: "lg", sm: "normal" }}
    >
      <PaletteProvider value={value}>
        <Header />

        <Hexes />
      </PaletteProvider>
    </AppLayout>
  )
}

export default Page

export const getServerSideProps = async (req: GetServerSidePropsContext) => {
  const {
    props: { cookies, format, hex, palettes },
  } = await getServerSideCommonProps(req)
  const uuid = req.query.uuid as string
  let palette = getCookie<ColorPalette | null>(
    cookies,
    `${CONSTANT.STORAGE.PALETTE}-${uuid}`,
    null,
  )
  const tab = getCookie<string>(cookies, CONSTANT.STORAGE.PALETTE_TAB, "tones")

  if (!palette) return { notFound: true }

  palette.name = decodeURIComponent(palette.name)

  const props = {
    cookies,
    format,
    hex,
    palettes,
    palette,
    tab,
  }

  return { props }
}
