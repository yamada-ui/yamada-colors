import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import {
  Box,
  Center,
  Grid,
  GridItem,
  Motion,
  useUpdateEffect,
  Wrap,
} from "@yamada-ui/react"
import { categories, ColorCard } from "components/data-display"
import { NextLinkButton } from "components/navigation"
import { useI18n } from "contexts/i18n-context"
import { getRandomColors } from "functions/get-random-colors"
import { AppLayout } from "layouts/app-layout"
import { useCallback, useState } from "react"
import { getServerSideCommonProps } from "utils/next"
import { toCamelCase } from "utils/string"

export const getServerSideProps = (req: GetServerSidePropsContext) => {
  const {
    props: { cookies, format, hex, palettes },
  } = getServerSideCommonProps(req)
  const category = req.query.category as string
  const colors = getRandomColors({ category, count: 120 })

  const props = { categories, category, colors, cookies, format, hex, palettes }

  return { props }
}

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({
  categories,
  category: currentCategory,
  colors: defaultColors,
  format,
  hex,
  palettes,
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
      description={t("categories.description")}
      format={format}
      hex={hex}
      palettes={palettes}
      title={toCamelCase(currentCategory)}
    >
      <Box as="nav">
        <Wrap as="ul" gap="sm" mb={{ base: "lg", sm: "normal" }}>
          {categories.map((category) => {
            const isCurrent = category === currentCategory

            return (
              <Box key={category} as="li">
                <NextLinkButton
                  href={`/categories/${category}`}
                  colorScheme={category}
                  variant={isCurrent ? "solid" : "outline"}
                  isRounded
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
        gap="md"
        templateColumns={{
          base: "repeat(4, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          xl: "repeat(2, 1fr)",
        }}
      >
        {colors.map(({ name, hex }, index) => (
          <GridItem key={`${hex}-${index}`} as="li">
            <ColorCard name={name} hex={hex} />
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
