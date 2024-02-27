import { createContext } from "@yamada-ui/react"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import type { Dispatch, SetStateAction } from "react"
import { useMemo, useState } from "react"
import { Header } from "./header"
import { Hexes } from "./hexes"
import { CONSTANT } from "constant"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { getServerSideCommonProps } from "utils/next"
import { generateUUID, getCookie } from "utils/storage"

type PaletteContext = {
  uuid: string
  name: string
  colors: OrderColors
  setName: Dispatch<SetStateAction<string>>
  setColors: Dispatch<SetStateAction<OrderColors>>
}

export const [PaletteProvider, usePalette] = createContext<PaletteContext>()

export type OrderColor = Color & { id: string }
export type OrderColors = OrderColor[]

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({ hex, format, palettes, palette }) => {
  const { t } = useI18n()
  const [name, setName] = useState<string>(palette.name)
  const [colors, setColors] = useState<OrderColors>(
    palette.colors.map((color) => ({ id: generateUUID(), ...color })),
  )
  const { uuid } = palette

  const value = useMemo(
    () => ({ uuid, name, colors, setName, setColors }),
    [uuid, colors, name],
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
  const palette = getCookie<ColorPalette | null>(
    cookies,
    `${CONSTANT.STORAGE.PALETTE}-${uuid}`,
    null,
  )

  if (!palette) return { notFound: true }

  const props = {
    cookies,
    format,
    hex,
    palettes,
    palette,
  }

  return { props }
}
