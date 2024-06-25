import type { ColorMode } from "@yamada-ui/react"
import { Grid, defaultTheme } from "@yamada-ui/react"
import * as c from "color2k"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { useRef } from "react"
import { ContrastChecker } from "./contrast-checker"
import { Header } from "./header"
import { CONSTANT } from "constant"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { isReadable, readability } from "utils/color"
import { getServerSideCommonProps } from "utils/next"
import { getCookie } from "utils/storage"

export type Contrast = {
  fg: string
  bg: string
  score: number
  aa: ContrastLevelScore
  aaa: ContrastLevelScore
}

export type ContrastLevel = { aa: boolean; aaa: boolean }
export type ContrastLevelScore = {
  small: boolean
  large: boolean
  component: boolean
}
export type ContrastGround = "fg" | "bg"

export const getContrast = (
  mode: "light" | "dark",
  fg: any,
  bg: any,
): Contrast => {
  const { white, black } = defaultTheme.colors
  const fallback = mode === "light" ? white : black

  fg = c.toHex(`#${fg.replace("#", "")}`)
  bg = bg ? c.toHex(`#${bg.replace("#", "")}`) : fallback

  return {
    fg,
    bg,
    score: readability(fg, bg),
    aa: {
      small: isReadable(fg, bg, { level: "AA", size: "small" }),
      large: isReadable(fg, bg, { level: "AA", size: "large" }),
      component: isReadable(fg, bg, { level: "AA", size: "component" }),
    },
    aaa: {
      small: isReadable(fg, bg, { level: "AA", size: "small" }),
      large: isReadable(fg, bg, { level: "AA", size: "large" }),
      component: isReadable(fg, bg, { level: "AAA", size: "component" }),
    },
  }
}

export const getServerSideProps = async (req: GetServerSidePropsContext) => {
  const {
    props: { cookies, format, palettes },
  } = await getServerSideCommonProps(req)
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
      cookies,
      format,
      palettes,
      level,
      hexes,
      light,
      dark,
    }

    return { props }
  } catch {
    return { notFound: true }
  }
}

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({
  level,
  hexes,
  palettes,
  format,
  light,
  dark,
}) => {
  const { t } = useI18n()
  const setLevelRef = useRef<Map<ColorMode, (level: ContrastLevel) => void>>(
    new Map(),
  )
  const queriesRef = useRef(
    new URLSearchParams({
      "light.fg": light.fg.replace("#", ""),
      "light.bg": light.bg.replace("#", ""),
      "dark.fg": dark.fg.replace("#", ""),
      "dark.bg": dark.bg.replace("#", ""),
    }),
  )

  return (
    <AppLayout
      title={t("contrast-checker.title")}
      description={t("contrast-checker.description")}
      hex={hexes}
      format={format}
      palettes={palettes}
      gap={{ base: "lg", sm: "normal" }}
    >
      <Header {...{ hexes, level, setLevelRef }} />

      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)",
          xl: "1fr",
          lg: "repeat(2, 1fr)",
          md: "1fr",
        }}
        gap="lg"
      >
        <ContrastChecker
          mode="light"
          contrast={light}
          level={level}
          setLevelRef={setLevelRef}
          queriesRef={queriesRef}
        />
        <ContrastChecker
          mode="dark"
          contrast={dark}
          level={level}
          setLevelRef={setLevelRef}
          queriesRef={queriesRef}
        />
      </Grid>
    </AppLayout>
  )
}

export default Page
