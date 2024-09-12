import type {
  FlexProps,
  GridProps,
  IconButtonProps,
  StackProps,
  StringLiteral,
} from "@yamada-ui/react"
import {
  Box,
  ChevronIcon,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  IconButton,
  Text,
  VStack,
  forwardRef,
} from "@yamada-ui/react"
import type { FC, PropsWithChildren } from "react"
import { memo, useRef } from "react"
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
          <HStack as="header">
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

          <Box as="nav">
            {type === "carousel" ? (
              <CategoryCarousel size={size} colors={colors} />
            ) : (
              <CategoryGrid size={size} colors={colors} />
            )}
          </Box>
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

const getSlideSize = (count: number) =>
  `calc(100% / ${count} - (var(--ui-slide-gap) * ${count - 1}) / ${count})`

type CategoryCarouselProps = FlexProps & {
  size?: CategorySize
  colors: Colors
}

const CategoryCarousel: FC<CategoryCarouselProps> = memo(
  ({ size = "md", colors, ...rest }) => {
    const ref = useRef<HTMLUListElement>(null)
    const length = colors.length

    const onScrollMove = (direction: "left" | "right") => {
      if (!ref.current) return

      const scrollLeft = ref.current.scrollLeft

      if (direction === "left") {
        ref.current.scrollTo({
          left: scrollLeft - ref.current.scrollWidth / length,
          behavior: "smooth",
        })
      } else {
        ref.current.scrollTo({
          left: scrollLeft + ref.current.scrollWidth / length,
          behavior: "smooth",
        })
      }
    }

    return (
      <Box
        position="relative"
        w="full"
        vars={[
          {
            name: "slide-gap",
            token: "spaces",
            value: "md",
          },
          {
            name: "slide-size",
            value: {
              base: size === "md" ? getSlideSize(3) : getSlideSize(4),
              md: size === "md" ? getSlideSize(2) : getSlideSize(3),
              sm: size === "md" ? getSlideSize(1) : getSlideSize(2),
            },
          },
        ]}
      >
        <Flex
          ref={ref}
          as="ul"
          w="full"
          gap="var(--ui-slide-gap)"
          overflowX="auto"
          overflowY="hidden"
          scrollSnapType="x mandatory"
          whiteSpace="nowrap"
          sx={{
            scrollbarWidth: "none",
            _scrollbar: { display: "none" },
            "&::-webkit-scrollbar": { display: "none" },
          }}
          {...rest}
        >
          {colors.map(({ name, hex }, index) => (
            <Box
              key={`${hex}-${index}`}
              as="li"
              listStyle="none"
              flexShrink={0}
              flexGrow={0}
              flexBasis="var(--ui-slide-size)"
              scrollSnapAlign="start"
            >
              <ColorCard
                hex={hex}
                name={size === "md" ? name : undefined}
                menuProps={{ strategy: "fixed" }}
              />
            </Box>
          ))}
        </Flex>

        <CategoryCarouselButton
          placement="left"
          size={size}
          onClick={() => onScrollMove("left")}
        />

        <CategoryCarouselButton
          placement="right"
          size={size}
          onClick={() => onScrollMove("right")}
        />
      </Box>
    )
  },
)

CategoryCarousel.displayName = "CategoryCarousel"

type CategoryCarouselButtonProps = Omit<IconButtonProps, "size"> & {
  placement: "left" | "right"
  size?: CategorySize
}

const CategoryCarouselButton: FC<CategoryCarouselButtonProps> = memo(
  ({ placement, size, ...rest }) => {
    return (
      <IconButton
        w={size === "md" ? "10" : "8"}
        h={size === "md" ? "10" : "8"}
        minW="auto"
        lineHeight="1"
        icon={
          <ChevronIcon
            fontSize={size === "md" ? "2xl" : "lg"}
            color={["blackAlpha.700", "whiteAlpha.800"]}
            transform={
              placement === "left" ? "rotate(90deg)" : "rotate(-90deg)"
            }
          />
        }
        isRounded
        position="absolute"
        top="50%"
        left={placement === "left" ? "var(--ui-slide-gap)" : undefined}
        right={placement === "right" ? "var(--ui-slide-gap)" : undefined}
        transform="translateY(-50%)"
        bg={["whiteAlpha.400", "blackAlpha.500"]}
        _hover={{ bg: ["whiteAlpha.500", "blackAlpha.600"] }}
        {...rest}
      />
    )
  },
)

CategoryCarouselButton.displayName = "CategoryCarouselButton"
