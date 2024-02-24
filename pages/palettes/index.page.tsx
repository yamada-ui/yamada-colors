import { noop } from "@yamada-ui/react"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { useRef } from "react"
import { Header } from "./header"
import { Palettes } from "./palettes"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { getServerSideCommonProps } from "utils/next"

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({ palettes, hex, format }) => {
  const { t } = useI18n()
  const onCreateRef = useRef<() => void>(noop)

  return (
    <AppLayout
      title={t("palettes.title")}
      description={t("palettes.description")}
      hex={hex}
      format={format}
      palettes={palettes}
      gap={{ base: "lg", sm: "normal" }}
    >
      <Header onCreateRef={onCreateRef} />

      <Palettes onCreate={() => onCreateRef.current()} />
    </AppLayout>
  )
}

export default Page

export const getServerSideProps = async (req: GetServerSidePropsContext) => {
  const {
    props: { cookies, format, hex, palettes },
  } = await getServerSideCommonProps(req)

  const props = {
    cookies,
    format,
    hex,
    palettes,
  }

  return { props }
}
