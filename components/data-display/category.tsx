import type { CarouselProps } from "@yamada-ui/carousel"
import { Carousel, CarouselSlide } from "@yamada-ui/carousel"
import type { GridProps, StackProps, StringLiteral } from "@yamada-ui/react"
import {
  AspectRatio,
  Box,
  Grid,
  GridItem,
  HStack,
  Heading,
  Motion,
  Text,
  VStack,
  forwardRef,
  useBreakpointValue,
} from "@yamada-ui/react"
import Link from "next/link"
import type { FC, PropsWithChildren } from "react"
import { memo } from "react"
import { NextLink } from "components/navigation"
import { useI18n } from "contexts/i18n-context"
import { isLight } from "utils/color"
import { toCamelCase } from "utils/string"

type CategoryType = "grid" | "carousel"
type CategorySize = "sm" | "md"

export const categories = [
  "gray",
  "red",
  "rose",
  "pink",
  "flashy",
  "fuchsia",
  "purple",
  "violet",
  "indigo",
  "blue",
  "sky",
  "cyan",
  "teal",
  "emerald",
  "green",
  "lime",
  "yellow",
  "amber",
  "orange",
] as const

export type Categories = (typeof categories)[number] | StringLiteral

export type CategoryProps = StackProps & {
  category: Categories
  colors: Colors
  type?: CategoryType
  size?: CategorySize
}

export const Category = memo(
  forwardRef<CategoryProps, "div">(
    ({ category, colors, type = "grid", size = "md", ...rest }, ref) => {
      const { t } = useI18n()

      return (
        <VStack as="article" ref={ref} {...rest}>
          <HStack>
            <CategoryTitle>{toCamelCase(category)}</CategoryTitle>

            <NextLink
              href={`/categories/${category}`}
              variant="muted"
              fontSize="sm"
              whiteSpace="nowrap"
            >
              {t("component.category.more")}
            </NextLink>
          </HStack>

          {type === "carousel" ? (
            <CategoryCarousel size={size} colors={colors} />
          ) : (
            <CategoryGrid size={size} colors={colors} />
          )}
        </VStack>
      )
    },
  ),
)

type CategoryTitleProps = PropsWithChildren<StackProps>

const CategoryTitle: FC<CategoryTitleProps> = memo(({ children, ...rest }) => {
  const { t } = useI18n()

  return (
    <VStack gap="0" {...rest}>
      <Text as="span" color="muted" fontSize="sm">
        {t("component.category.label")}
      </Text>

      <Heading size="lg" lineClamp={1}>
        {children}
      </Heading>
    </VStack>
  )
})

CategoryTitle.displayName = "CategoryTitle"

type CategoryGridProps = GridProps & {
  size?: CategorySize
  colors: Colors
}

const CategoryGrid: FC<CategoryGridProps> = memo(
  ({ size = "md", colors, ...rest }) => {
    const mdCount = useBreakpointValue({ base: 8, lg: 6, md: 8 })
    const smCount = useBreakpointValue({ base: 9, md: 10 })

    if (size === "md") {
      return (
        <Grid
          as="ul"
          templateColumns={{
            base: "repeat(4, 1fr)",
            xl: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap="md"
          {...rest}
        >
          {colors.slice(0, mdCount).map(({ name, hex }, index) => (
            <GridItem key={`${hex}-${index}`} as="li">
              <AspectRatio as={Link} href={`/colors/${hex.replace("#", "")}`}>
                <Motion
                  bg={hex}
                  color={isLight(hex) ? "black" : "white"}
                  p={{ base: "normal", lg: "md", md: "normal", sm: "md" }}
                  rounded="2xl"
                  whileHover={{ scale: 0.95 }}
                >
                  <VStack
                    boxSize="full"
                    justifyContent="flex-end"
                    gap={{ base: "xs", sm: "0" }}
                  >
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
      )
    } else {
      return (
        <Grid
          as="ul"
          templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(2, 1fr)" }}
          gap="md"
          {...rest}
        >
          {colors.slice(0, smCount).map(({ name, hex }, index) => (
            <GridItem key={`${hex}-${index}`} as="li">
              <Motion rounded="2xl" whileHover={{ scale: 0.95 }}>
                <Grid
                  as={Link}
                  href={`/colors/${hex.replace("#", "")}`}
                  templateColumns={{ base: "auto 1fr" }}
                  gap={{ base: "md", sm: "sm" }}
                >
                  <Box boxSize={{ base: "12" }} bg={hex} rounded="2xl" />

                  <VStack gap={{ base: "xs", sm: "0" }} justifyContent="center">
                    <Text as="span" fontWeight="medium" lineClamp={1}>
                      {name}
                    </Text>

                    <Text as="span" fontSize="sm" color="muted" lineClamp={1}>
                      {hex}
                    </Text>
                  </VStack>
                </Grid>
              </Motion>
            </GridItem>
          ))}
        </Grid>
      )
    }
  },
)

CategoryGrid.displayName = "CategoryGrid"

type CategoryCarouselProps = CarouselProps & {
  size?: CategorySize
  colors: Colors
}

const CategoryCarousel: FC<CategoryCarouselProps> = memo(
  ({ size = "md", colors, ...rest }) => {
    return (
      <Carousel
        innerProps={{ as: "ul", h: "auto" }}
        slideSize={{
          base: size === "md" ? "33.3%" : "25%",
          md: size === "md" ? "50%" : "33.3%",
          sm: size === "md" ? "100%" : "50%",
        }}
        align="start"
        withIndicators={false}
        {...rest}
      >
        {colors.map(({ name, hex }, index) => (
          <CarouselSlide key={`${hex}-${index}`} as="li">
            <AspectRatio as={Link} href={`/colors/${hex.replace("#", "")}`}>
              <Motion
                bg={hex}
                color={isLight(hex) ? "black" : "white"}
                p={{ base: "normal", lg: "md", md: "normal", sm: "md" }}
                rounded="2xl"
                whileHover={{ scale: 0.95 }}
              >
                <VStack
                  boxSize="full"
                  justifyContent="flex-end"
                  gap={{ base: "xs", sm: "0" }}
                >
                  {size === "md" ? (
                    <Text as="span" fontWeight="medium" lineClamp={1}>
                      {name}
                    </Text>
                  ) : null}

                  <Text
                    as="span"
                    fontSize="sm"
                    textAlign={size === "md" ? "left" : "center"}
                    lineClamp={1}
                  >
                    {hex}
                  </Text>
                </VStack>
              </Motion>
            </AspectRatio>
          </CarouselSlide>
        ))}
      </Carousel>
    )
  },
)

CategoryCarousel.displayName = "CategoryCarousel"
