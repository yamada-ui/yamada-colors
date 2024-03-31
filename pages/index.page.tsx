import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { Category, categories } from "components/data-display"
import { useI18n } from "contexts/i18n-context"
import { getRandomColors } from "functions/get-random-colors"
import { AppLayout } from "layouts/app-layout"
import { getServerSideCommonProps } from "utils/next"

export const getServerSideProps = async (req: GetServerSidePropsContext) => {
  const {
    props: { cookies, hex, format, palettes },
  } = await getServerSideCommonProps(req)

  const omittedCategories = (categories as unknown as string[])
    .sort(() => 0.5 - Math.random())
    .slice(0, 8)

  const computedCategories = omittedCategories.map((category) => {
    const colors = getRandomColors({ category })

    return { category, colors }
  })

  const props = {
    cookies,
    hex,
    format,
    categories: computedCategories,
    palettes,
  }

  return { props }
}

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({ hex, format, categories, palettes }) => {
  const { t } = useI18n()

  return (
    <AppLayout
      title={t("app.title")}
      description={t("app.description")}
      gap={{ base: "lg", sm: "normal" }}
      hex={hex}
      format={format}
      palettes={palettes}
    >
      {categories.map(({ category, colors }, index) => {
        const type = index % 4 === 2 || index % 4 === 3 ? "carousel" : "grid"
        const size = index % 2 === 0 ? "md" : "sm"

        return (
          <Category
            key={category}
            category={category}
            colors={colors}
            type={type}
            size={size}
          />
        )
      })}
    </AppLayout>
  )
}

export default Page
