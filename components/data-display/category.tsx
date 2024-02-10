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
import { toCamelCase } from "utils/assertion"
import { isLight } from "utils/color"

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

export type CategoryProps = StackProps & {
  category: (typeof categories)[number] | StringLiteral
  colors: { hex: string; name: string }[]
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
  colors: { hex: string; name: string }[]
}

const CategoryGrid: FC<CategoryGridProps> = memo(
  ({ size = "md", colors, ...rest }) => {
    const count = useBreakpointValue({ base: 9, md: 10 })

    if (size === "md") {
      return (
        <Grid
          templateColumns={{
            base: "repeat(4, 1fr)",
            xl: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap="md"
          {...rest}
        >
          {colors.slice(0, 8).map(({ name, hex }, index) => (
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
      )
    } else {
      return (
        <Grid
          templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(2, 1fr)" }}
          gap="md"
          {...rest}
        >
          {colors.slice(0, count).map(({ name, hex }, index) => (
            <GridItem
              key={`${hex}-${index}`}
              as={Link}
              href={`/colors/${hex.replace("#", "")}`}
            >
              <Motion rounded="xl" whileHover={{ scale: 0.95 }}>
                <Grid
                  templateColumns={{ base: "auto 1fr" }}
                  gap={{ base: "md" }}
                >
                  <Box boxSize={{ base: "12" }} bg={hex} rounded="xl" />

                  <VStack gap="xs">
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
  colors: { hex: string; name: string }[]
}

const CategoryCarousel: FC<CategoryCarouselProps> = memo(
  ({ size = "md", colors, ...rest }) => {
    return (
      <Carousel
        innerProps={{ h: "auto" }}
        slideSize={{
          base: size === "md" ? "33.3%" : "25%",
          md: size === "md" ? "50%" : "33.3%",
        }}
        align="start"
        withIndicators={false}
        {...rest}
      >
        {colors.map(({ name, hex }, index) => (
          <CarouselSlide
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