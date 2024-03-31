import { noop } from "@yamada-ui/react"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { useEffect, useRef } from "react"
import { Header } from "./header"
import { Palettes } from "./palettes"
import { CONSTANT } from "constant"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { getServerSideCommonProps } from "utils/next"
import { deleteCookie, getCookie } from "utils/storage"

export const getServerSideProps = async (req: GetServerSidePropsContext) => {
  const {
    props: { cookies, format, hex, palettes },
  } = await getServerSideCommonProps(req)
  const query = getCookie<string>(cookies, CONSTANT.STORAGE.PALETTE_QUERY, "")

  const props = {
    cookies,
    format,
    hex,
    palettes,
    query,
  }

  return { props }
}

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({ palettes, hex, format, query }) => {
  const { t } = useI18n()
  const onCreateRef = useRef<() => void>(noop)
  const onSearchRef = useRef<(query: string) => void>(noop)

  useEffect(() => {
    deleteCookie(CONSTANT.STORAGE.PALETTE_QUERY)
  }, [])

  return (
    <AppLayout
      title={t("palettes.title")}
      description={t("palettes.description")}
      hex={hex}
      format={format}
      palettes={palettes}
      gap={{ base: "lg", sm: "normal" }}
    >
      <Header
        onCreateRef={onCreateRef}
        query={query}
        onSearch={(value) => onSearchRef.current(value)}
      />

      <Palettes
        onCreate={() => onCreateRef.current()}
        query={query}
        onSearchRef={onSearchRef}
      />
    </AppLayout>
  )
}

export default Page
