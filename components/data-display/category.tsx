import type { CarouselProps } from "@yamada-ui/carousel"
import { Carousel, CarouselSlide } from "@yamada-ui/carousel"
import type { GridProps, StackProps, StringLiteral } from "@yamada-ui/react"
import {
  Grid,
  GridItem,
  HStack,
  Heading,
  Text,
  VStack,
  forwardRef,
} from "@yamada-ui/react"
import type { FC, PropsWithChildren } from "react"
import { memo } from "react"
import { ColorCard } from "./color-card"
import { NextLink } from "components/navigation"
import { useI18n } from "contexts/i18n-context"
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
          {colors.map(({ name, hex }, index) => (
            <GridItem
              key={`${hex}-${index}`}
              as="li"
              display={{
                base: index < 8 ? "block" : "none",
                lg: index < 6 ? "block" : "none",
                md: index < 8 ? "block" : "none",
              }}
            >
              <ColorCard hex={hex} name={name} />
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
          {colors.map(({ name, hex }, index) => (
            <GridItem
              key={`${hex}-${index}`}
              as="li"
              display={{
                base: index < 9 ? "block" : "none",
                md: "block",
              }}
            >
              <ColorCard size="md" hex={hex} name={name} />
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
        var={[
          {
            name: "slide-size",
            value: {
              base: size === "md" ? "33.3%" : "25%",
              md: size === "md" ? "50%" : "33.3%",
              sm: size === "md" ? "100%" : "50%",
            },
          },
        ]}
        slideSize="var(--ui-slide-size)"
        align="start"
        withIndicators={false}
        {...rest}
      >
        {colors.map(({ name, hex }, index) => (
          <CarouselSlide key={`${hex}-${index}`} as="li">
            <ColorCard hex={hex} name={size === "md" ? name : undefined} />
          </CarouselSlide>
        ))}
      </Carousel>
    )
  },
)

CategoryCarousel.displayName = "CategoryCarousel"
