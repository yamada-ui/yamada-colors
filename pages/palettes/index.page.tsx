import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { noop } from "@yamada-ui/react"
import { CONSTANT } from "constant"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { useEffect, useRef } from "react"
import { getServerSideCommonProps } from "utils/next"
import { deleteCookie, getCookie } from "utils/storage"
import { Header } from "./header"
import { Palettes } from "./palettes"

export const getServerSideProps = (req: GetServerSidePropsContext) => {
  const {
    props: { cookies, format, hex, palettes },
  } = getServerSideCommonProps(req)
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

const Page: NextPage<PageProps> = ({ format, hex, palettes, query }) => {
  const { t } = useI18n()
  const onCreateRef = useRef<() => void>(noop)
  const onSearchRef = useRef<(query: string) => void>(noop)

  useEffect(() => {
    deleteCookie(CONSTANT.STORAGE.PALETTE_QUERY)
  }, [])

  return (
    <AppLayout
      description={t("palettes.description")}
      format={format}
      gap={{ base: "lg", sm: "normal" }}
      hex={hex}
      palettes={palettes}
      title={t("palettes.title")}
    >
      <Header
        query={query}
        onCreateRef={onCreateRef}
        onSearch={(value) => onSearchRef.current(value)}
      />

      <Palettes
        query={query}
        onCreate={() => onCreateRef.current()}
        onSearchRef={onSearchRef}
      />
    </AppLayout>
  )
}

export default Page
