import { Grid, defaultTheme } from "@yamada-ui/react"
import * as c from "color2k"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { useState } from "react"
import { Contrast } from "./contrast"
import { Header } from "./header"
import { CONSTANT } from "constant"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { isReadable, readability } from "utils/color"
import { getServerSideCommonProps } from "utils/next"
import { getCookie } from "utils/storage"

const getContrast = (
  mode: "light" | "dark",
  query: GetServerSidePropsContext["query"],
) => {
  const { white, black } = defaultTheme.colors
  const fallback = mode === "light" ? white : black
  const fg = c.toHex(`#${query[`${mode}.fg`]}`)
  const bg = query[`${mode}.bg`] ? `#${query[`${mode}.bg`]}` : fallback

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
  const level = getCookie<{ aa: boolean; aaa: boolean }>(
    cookies,
    CONSTANT.STORAGE.LEVEL,
    '{ "aa": true, "aaa": false }',
  )

  try {
    const light = getContrast("light", req.query)
    const dark = getContrast("dark", req.query)
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
  const [{ aa, aaa }, setLevel] = useState(level)
  const queries = new URLSearchParams({
    "light.fg": light.fg.replace("#", ""),
    "light.bg": light.bg.replace("#", ""),
    "dark.fg": dark.fg.replace("#", ""),
    "dark.bg": dark.bg.replace("#", ""),
  })

  return (
    <AppLayout
      title={t("contrast-checker.title")}
      description={t("contrast-checker.description")}
      hex={hexes}
      format={format}
      palettes={palettes}
      gap={{ base: "lg", sm: "normal" }}
    >
      <Header {...{ hexes, aa, aaa, setLevel }} />

      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)",
          xl: "1fr",
          lg: "repeat(2, 1fr)",
          md: "1fr",
        }}
        gap="lg"
      >
        <Contrast
          mode="light"
          {...light}
          level={{ aa, aaa }}
          queries={queries}
        />
        <Contrast mode="dark" {...dark} level={{ aa, aaa }} queries={queries} />
      </Grid>
    </AppLayout>
  )
}

export default Page
