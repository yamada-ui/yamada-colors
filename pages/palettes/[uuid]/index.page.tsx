import { runIfFunc, type ColorMode } from "@yamada-ui/react"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import type { SetStateAction } from "react"
import { useCallback, useMemo, useRef, useState } from "react"
import { PaletteProvider } from "./context"
import { Header } from "./header"
import { Hexes } from "./hexes"
import { CONSTANT } from "constant"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { getServerSideCommonProps } from "utils/next"
import { generateUUID, getCookie } from "utils/storage"

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
  const tab = getCookie<string>(
    cookies,
    CONSTANT.STORAGE.PALETTE_TAB,
    "palettes",
  )
  const colorMode = getCookie<ColorMode>(
    cookies,
    CONSTANT.STORAGE.PALETTE_COLOR_MODE,
    "light",
  )

  if (!palette) return { notFound: true }

  palette.name = decodeURIComponent(palette.name)

  const props = {
    cookies,
    format,
    hex,
    palettes,
    palette,
    colorMode,
    tab,
  }

  return { props }
}

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({
  hex,
  format,
  palettes,
  palette,
  tab: tabProp,
  colorMode,
}) => {
  const { t } = useI18n()
  const [name, setName] = useState<string>(palette.name)
  const [colors, setColors] = useState<ReorderColors>(
    palette.colors.map((color) => ({ id: generateUUID(), ...color })),
  )

  const [tab, setTab] = useState<string>(tabProp)
  const { uuid, timestamp } = palette
  const indexRef = useRef<number>(0)
  const colorsMapRef = useRef<ReorderColors[]>([colors])

  const changeColors = useCallback(
    (valOrFunc: SetStateAction<ReorderColors>, isRollback: boolean = false) =>
      setColors((prev) => {
        const next = runIfFunc(valOrFunc, prev)

        if (!isRollback) {
          if (indexRef.current !== colorsMapRef.current.length - 1) {
            colorsMapRef.current = colorsMapRef.current.slice(
              0,
              indexRef.current + 1,
            )
          }

          colorsMapRef.current.push(next)
          indexRef.current = colorsMapRef.current.length - 1
        }
        return next
      }),
    [],
  )

  const value = useMemo(
    () => ({
      tab,
      colorMode,
      uuid,
      name,
      colors,
      timestamp,
      setTab,
      setName,
      changeColors,
      colorsMapRef,
      indexRef,
    }),
    [tab, changeColors, colorMode, uuid, colors, name, timestamp],
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
