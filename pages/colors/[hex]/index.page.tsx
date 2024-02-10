import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { getServerSideCommonProps } from "utils/next"

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({ hex }) => {
  const { t } = useI18n()

  return (
    <AppLayout
      title={hex}
      description={t("app.description")}
      gap="lg"
    ></AppLayout>
  )
}

export default Page

export const getServerSideProps = async (req: GetServerSidePropsContext) => {
  const {
    props: { cookies },
  } = await getServerSideCommonProps(req)
  const hex = `#${req.query.hex}` as string

  const props = { cookies, hex }

  return { props }
}
