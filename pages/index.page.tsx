import { defaultTheme } from "@yamada-ui/react"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { Category, categories } from "components/data-display"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { getColorName } from "utils/color-name-list"
import { getServerSideCommonProps } from "utils/next"
import randomColor from "utils/random-color"

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({ categories }) => {
  const { t } = useI18n()

  return (
    <AppLayout
      title={t("app.title")}
      description={t("app.description")}
      gap="lg"
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

export const getServerSideProps = async (req: GetServerSidePropsContext) => {
  const {
    props: { cookies },
  } = await getServerSideCommonProps(req)

  const omittedCategories = (categories as unknown as string[])
    .sort(() => 0.5 - Math.random())
    .slice(0, 8)

  const computedCategories = omittedCategories.map((category) => {
    let hue = defaultTheme.colors[category][500]

    if (category === "gray") hue = "monochrome"

    const hexes = randomColor({ count: 10, luminosity: "bright", hue })
    const colors = hexes.map((hex) => ({ hex, name: getColorName(hex) }))

    return { category, colors }
  })

  const props = { cookies, categories: computedCategories }

  return { props }
}
