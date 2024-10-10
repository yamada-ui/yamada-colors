import type { ColorMode } from "@yamada-ui/react"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import type { SetStateAction } from "react"
import { runIfFunc } from "@yamada-ui/react"
import { CONSTANT } from "constant"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { useCallback, useMemo, useRef, useState } from "react"
import { getServerSideCommonProps } from "utils/next"
import { generateUUID, getCookie } from "utils/storage"
import { PaletteProvider } from "./context"
import { Header } from "./header"
import { Hexes } from "./hexes"

export const getServerSideProps = (req: GetServerSidePropsContext) => {
  const {
    props: { cookies, format, hex, palettes },
  } = getServerSideCommonProps(req)
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
    colorMode,
    cookies,
    format,
    hex,
    palette,
    palettes,
    tab,
  }

  return { props }
}

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({
  colorMode,
  format,
  hex,
  palette,
  palettes,
  tab: tabProp,
}) => {
  const { t } = useI18n()
  const [name, setName] = useState<string>(palette.name)
  const [colors, setColors] = useState<ReorderColors>(
    palette.colors.map((color) => ({ id: generateUUID(), ...color })),
  )

  const [tab, setTab] = useState<string>(tabProp)
  const { timestamp, uuid } = palette
  const indexRef = useRef<number>(0)
  const colorsMapRef = useRef<ReorderColors[]>([colors])

  const changeColors = useCallback(
    (valOrFunc: SetStateAction<ReorderColors>, isRollback = false) =>
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
      name,
      changeColors,
      colorMode,
      colors,
      colorsMapRef,
      indexRef,
      setName,
      setTab,
      tab,
      timestamp,
      uuid,
    }),
    [tab, changeColors, colorMode, uuid, colors, name, timestamp],
  )

  return (
    <AppLayout
      description={t("palettes.description")}
      format={format}
      gap={{ base: "lg", sm: "normal" }}
      hex={hex}
      palettes={palettes}
      title={palette.name}
    >
      <PaletteProvider value={value}>
        <Header />

        <Hexes />
      </PaletteProvider>
    </AppLayout>
  )
}

export default Page
