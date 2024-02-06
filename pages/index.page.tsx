import type { InferGetServerSidePropsType, NextPage } from "next"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { getServerSideCommonProps } from "utils/next"

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({}) => {
  const { t } = useI18n()

  return (
    <AppLayout
      title={t("app.title")}
      description={t("app.description")}
    ></AppLayout>
  )
}

export default Page

export const getServerSideProps = getServerSideCommonProps
