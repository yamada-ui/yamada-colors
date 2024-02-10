import {
  AspectRatio,
  Center,
  Grid,
  GridItem,
  Motion,
  Text,
  VStack,
  Wrap,
  useUpdateEffect,
} from "@yamada-ui/react"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import Link from "next/link"
import { useCallback, useState } from "react"
import { categories } from "components/data-display"
import { NextLinkButton } from "components/navigation"
import { useI18n } from "contexts/i18n-context"
import { getRandomColors } from "functions/get-random-colors"
import { AppLayout } from "layouts/app-layout"
import { toCamelCase } from "utils/assertion"
import { isLight } from "utils/color"
import { getServerSideCommonProps } from "utils/next"

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({
  category: currentCategory,
  categories,
  colors: defaultColors,
}) => {
  const [colors, setColors] =
    useState<{ hex: string; name: string }[]>(defaultColors)
  const { t } = useI18n()

  const onViewportEnter = useCallback(async () => {
    const queries = new URLSearchParams({ count: "120" })
    const res = await fetch(`/api/categories/${currentCategory}?${queries}`)
    const data: { colors: { hex: string; name: string }[] } = await res.json()
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
    >
      <Wrap gap="sm" mb="lg">
        {categories.map((category) => {
          const isCurrent = category === currentCategory

          return (
            <NextLinkButton
              key={category}
              href={`/categories/${category}`}
              rounded="full"
              variant={isCurrent ? "solid" : "outline"}
              colorScheme={category}
            >
              {toCamelCase(category)}
            </NextLinkButton>
          )
        })}
      </Wrap>

      <Grid
        templateColumns={{
          base: "repeat(4, 1fr)",
          xl: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          md: "repeat(2, 1fr)",
        }}
        gap="md"
      >
        {colors.map(({ name, hex }, index) => (
          <GridItem
            key={`${hex}-${index}`}
            as={Link}
            href={`/colors/${hex.replace("#", "")}`}
          >
            <AspectRatio>
              <Motion
                bg={hex}
                color={isLight(hex) ? "black" : "white"}
                p={{ base: "normal", lg: "md", md: "normal" }}
                rounded="xl"
                whileHover={{ scale: 0.95 }}
              >
                <VStack boxSize="full" justifyContent="flex-end" gap="xs">
                  <Text as="span" fontWeight="medium" lineClamp={1}>
                    {name}
                  </Text>

                  <Text as="span" fontSize="sm" lineClamp={1}>
                    {hex}
                  </Text>
                </VStack>
              </Motion>
            </AspectRatio>
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

export const getServerSideProps = async (req: GetServerSidePropsContext) => {
  const {
    props: { cookies },
  } = await getServerSideCommonProps(req)
  const category = req.query.category as string
  const colors = getRandomColors({ category, count: 120 })

  const props = { cookies, category, categories, colors }

  return { props }
}
