import * as c from "color2k"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { Data } from "./data"
import { Header } from "./header"
import { useHistory } from "./use-history"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { toCielab, toCielch, toCmyk, toHsl, toHsv, toRgb } from "utils/color"
import { getColorName } from "utils/color-name-list"
import { getServerSideCommonProps } from "utils/next"

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

export type ColorData = PageProps["data"]

const Page: NextPage<PageProps> = ({ cookies, hex, name, data }) => {
  useHistory({ cookies, hex })
  const { t } = useI18n()

  return (
    <AppLayout title={hex} description={t("app.description")} gap="lg">
      <Header {...{ hex, name }} />
      <Data {...data} />
    </AppLayout>
  )
}

export default Page

export const getServerSideProps = async (req: GetServerSidePropsContext) => {
  const {
    props: { cookies },
  } = await getServerSideCommonProps(req)
  let hex = `#${req.query.hex}` as string

  try {
    hex = c.toHex(hex)

    const name = getColorName(hex)
    const rgb = toRgb(hex)
    const hsl = toHsl(hex)
    const hsv = toHsv(hex)
    const cmyk = toCmyk(hex)
    const cielab = toCielab(hex)
    const cielch = toCielch(hex)

    const data = { name, hex, rgb, hsl, hsv, cmyk, cielab, cielch }

    const props = { cookies, name, hex, data }

    return { props }
  } catch {
    return { notFound: true }
  }
}
