import {
  Box,
  Center,
  Grid,
  GridItem,
  Motion,
  Wrap,
  useUpdateEffect,
} from "@yamada-ui/react"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { useCallback, useState } from "react"
import { ColorCard, categories } from "components/data-display"
import { NextLinkButton } from "components/navigation"
import { useI18n } from "contexts/i18n-context"
import { getRandomColors } from "functions/get-random-colors"
import { AppLayout } from "layouts/app-layout"
import { getServerSideCommonProps } from "utils/next"
import { toCamelCase } from "utils/string"

export const getServerSideProps = async (req: GetServerSidePropsContext) => {
  const {
    props: { cookies, hex, format, palettes },
  } = await getServerSideCommonProps(req)
  const category = req.query.category as string
  const colors = getRandomColors({ category, count: 120 })

  const props = { cookies, hex, format, palettes, category, categories, colors }

  return { props }
}

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({
  hex,
  category: currentCategory,
  categories,
  format,
  palettes,
  colors: defaultColors,
}) => {
  const [colors, setColors] = useState<Colors>(defaultColors)
  const { t } = useI18n()

  const onViewportEnter = useCallback(async () => {
    const queries = new URLSearchParams({ count: "120" })
    const res = await fetch(`/api/categories/${currentCategory}?${queries}`)
    const data: { colors: Colors } = await res.json()
    const { colors } = data

    setColors((prev) => [...prev, ...colors])
  }, [currentCategory])

  useUpdateEffect(() => {
    setColors(defaultColors)
  }, [defaultColors])

  return (
    <AppLayout
      title={toCamelCase(currentCategory)}
      description={t("categories.description")}
      hex={hex}
      format={format}
      palettes={palettes}
    >
      <Box as="nav">
        <Wrap as="ul" gap="sm" mb={{ base: "lg", sm: "normal" }}>
          {categories.map((category) => {
            const isCurrent = category === currentCategory

            return (
              <Box key={category} as="li">
                <NextLinkButton
                  href={`/categories/${category}`}
                  isRounded
                  variant={isCurrent ? "solid" : "outline"}
                  colorScheme={category}
                >
                  {toCamelCase(category)}
                </NextLinkButton>
              </Box>
            )
          })}
        </Wrap>
      </Box>

      <Grid
        as="ul"
        templateColumns={{
          base: "repeat(4, 1fr)",
          xl: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          md: "repeat(2, 1fr)",
        }}
        gap="md"
      >
        {colors.map(({ name, hex }, index) => (
          <GridItem key={`${hex}-${index}`} as="li">
            <ColorCard hex={hex} name={name} />
          </GridItem>
        ))}
      </Grid>

      <Center>
        <Motion
          viewport={{ margin: "0px 0px 100% 0px" }}
          onViewportEnter={onViewportEnter}
        />
      </Center>
    </AppLayout>
  )
}

export default Page
