import type { InferGetServerSidePropsType, NextPage } from "next"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { getServerSideCommonProps } from "utils/next"

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({ hex, format }) => {
  const { t } = useI18n()

  return (
    <AppLayout
      title={t("palettes.title")}
      description={t("palettes.description")}
      hex={hex}
      format={format}
    ></AppLayout>
  )
}

export default Page

export const getServerSideProps = getServerSideCommonProps
