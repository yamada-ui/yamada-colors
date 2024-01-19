import type { InferGetServerSidePropsType, NextPage } from "next"
import { SEO } from "components/media-and-icons"
import { NextLinkButton } from "components/navigation"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { getServerSideCommonProps } from "utils/next"

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({}) => {
  const { t, tc } = useI18n()

  return (
    <AppLayout>
      <SEO
        title={t("not-found.title")}
        description={t("not-found.description")}
      />

      <NextLinkButton href="/" size="lg">
        {tc("not-found.back-to-app")}
      </NextLinkButton>
    </AppLayout>
  )
}

export default Page

export const getServerSideProps = getServerSideCommonProps
