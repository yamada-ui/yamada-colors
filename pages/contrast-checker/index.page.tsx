import type { ColorMode } from "@yamada-ui/react"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { defaultTheme, Grid } from "@yamada-ui/react"
import * as c from "color2k"
import { CONSTANT } from "constant"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { useRef } from "react"
import { isReadable, readability } from "utils/color"
import { getServerSideCommonProps } from "utils/next"
import { getCookie } from "utils/storage"
import { ContrastChecker } from "./contrast-checker"
import { Header } from "./header"

export interface ContrastLevel {
  aa: boolean
  aaa: boolean
}

export const getContrast = (
  mode: "dark" | "light",
  fg: any,
  bg: any,
): ColorContrast => {
  const { black, white } = defaultTheme.colors
  const fallback = mode === "light" ? white : black

  fg = c.toHex(`#${fg.replace("#", "")}`)
  bg = bg ? c.toHex(`#${bg.replace("#", "")}`) : fallback

  return {
    aa: {
      component: isReadable(fg, bg, { size: "component", level: "AA" }),
      large: isReadable(fg, bg, { size: "large", level: "AA" }),
      small: isReadable(fg, bg, { size: "small", level: "AA" }),
    },
    aaa: {
      component: isReadable(fg, bg, { size: "component", level: "AAA" }),
      large: isReadable(fg, bg, { size: "large", level: "AA" }),
      small: isReadable(fg, bg, { size: "small", level: "AA" }),
    },
    bg,
    fg,
    score: readability(fg, bg),
  }
}

export const getServerSideProps = (req: GetServerSidePropsContext) => {
  const {
    props: { cookies, format, palettes },
  } = getServerSideCommonProps(req)
  const level = getCookie<ContrastLevel>(
    cookies,
    CONSTANT.STORAGE.LEVEL,
    '{ "aa": true, "aaa": false }',
  )

  try {
    const { query } = req
    const light = getContrast("light", query["light.fg"], query["light.bg"])
    const dark = getContrast("dark", query["dark.fg"], query["dark.bg"])
    const hexes: [string, string] = [light.fg, dark.fg]

    const props = {
      light,
      cookies,
      dark,
      format,
      hexes,
      level,
      palettes,
    }

    return { props }
  } catch {
    return { notFound: true }
  }
}

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({
  light,
  dark,
  format,
  hexes,
  level,
  palettes,
}) => {
  const { t } = useI18n()
  const setLevelRef = useRef<Map<ColorMode, (level: ContrastLevel) => void>>(
    new Map(),
  )
  const queriesRef = useRef(
    new URLSearchParams({
      "dark.bg": dark.bg.replace("#", ""),
      "dark.fg": dark.fg.replace("#", ""),
      "light.bg": light.bg.replace("#", ""),
      "light.fg": light.fg.replace("#", ""),
    }),
  )

  return (
    <AppLayout
      description={t("contrast-checker.description")}
      format={format}
      gap={{ base: "lg", sm: "normal" }}
      hex={hexes}
      nofollow
      noindex
      palettes={palettes}
      title={t("contrast-checker.title")}
    >
      <Header {...{ hexes, level, setLevelRef }} />

      <Grid
        gap="lg"
        templateColumns={{
          base: "repeat(2, 1fr)",
          md: "1fr",
          lg: "repeat(2, 1fr)",
          xl: "1fr",
        }}
      >
        <ContrastChecker
          contrast={light}
          level={level}
          mode="light"
          queriesRef={queriesRef}
          setLevelRef={setLevelRef}
        />
        <ContrastChecker
          contrast={dark}
          level={level}
          mode="dark"
          queriesRef={queriesRef}
          setLevelRef={setLevelRef}
        />
      </Grid>
    </AppLayout>
  )
}

export default Page
