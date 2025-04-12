import type {
  GridItemProps,
  GridProps,
  IconButtonProps,
  StackProps,
  StringLiteral,
} from "@yamada-ui/react"
import type { FC, PropsWithChildren } from "react"
import {
  Box,
  ChevronIcon,
  forwardRef,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@yamada-ui/react"
import { Link } from "components/navigation"
import { useI18n } from "contexts/i18n-context"
import { memo, useRef } from "react"
import { toCamelCase } from "utils/string"
import { ColorCard } from "./color-card"

type CategoryType = "carousel" | "grid"
type CategorySize = "md" | "sm"

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

export interface CategoryProps extends StackProps {
  category: Categories
  colors: Colors
  type?: CategoryType
  size?: CategorySize
}

export const Category = memo(
  forwardRef<CategoryProps, "div">(
    ({ type = "grid", size = "md", category, colors, ...rest }, ref) => {
      const { t } = useI18n()

      return (
        <VStack ref={ref} as="article" {...rest}>
          <HStack as="header">
            <CategoryTitle>{toCamelCase(category)}</CategoryTitle>

            <Link
              href={`/categories/${category}`}
              variant="muted"
              fontSize="sm"
              prefetch
              whiteSpace="nowrap"
            >
              {t("component.category.more")}
            </Link>
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

interface CategoryTitleProps extends PropsWithChildren<StackProps> {}

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

interface CategoryGridProps extends GridProps {
  colors: Colors
  size?: CategorySize
}

const CategoryGrid: FC<CategoryGridProps> = memo(
  ({ size = "md", colors, ...rest }) => {
    if (size === "md") {
      return (
        <Grid
          as="ul"
          gap="md"
          templateColumns={{
            base: "repeat(4, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
            xl: "repeat(2, 1fr)",
          }}
          {...rest}
        >
          {colors.map(({ name, hex }, index) => (
            <GridItem
              key={`${hex}-${index}`}
              as="li"
              display={{
                base: index < 8 ? "block" : "none",
                md: index < 8 ? "block" : "none",
                lg: index < 6 ? "block" : "none",
              }}
            >
              <ColorCard name={name} hex={hex} />
            </GridItem>
          ))}
        </Grid>
      )
    } else {
      return (
        <Grid
          as="ul"
          gap="md"
          templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(2, 1fr)" }}
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
              <ColorCard name={name} size="md" hex={hex} />
            </GridItem>
          ))}
        </Grid>
      )
    }
  },
)

CategoryGrid.displayName = "CategoryGrid"

const getSlideSize = (count: number) =>
  `calc(100% / ${count} - ($slideGap * ${count - 1}) / ${count})`

interface CategoryCarouselProps extends GridItemProps {
  colors: Colors
  size?: CategorySize
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
          behavior: "smooth",
          left: scrollLeft - ref.current.scrollWidth / length,
        })
      } else {
        ref.current.scrollTo({
          behavior: "smooth",
          left: scrollLeft + ref.current.scrollWidth / length,
        })
      }
    }

    return (
      <Grid
        alignItems="center"
        gridTemplateColumns="auto 1fr auto"
        vars={[
          {
            name: "slideGap",
            token: "spaces",
            value: "md",
          },
          {
            name: "slideSize",
            value: {
              base: size === "md" ? getSlideSize(3) : getSlideSize(4),
              sm: size === "md" ? getSlideSize(1) : getSlideSize(2),
              md: size === "md" ? getSlideSize(2) : getSlideSize(3),
            },
          },
        ]}
        w="full"
      >
        <GridItem
          ref={ref}
          as="ul"
          sx={{
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
            _scrollbar: { display: "none" },
          }}
          display="flex"
          gap="$slideGap"
          gridColumn="1 / -1"
          gridRow="1"
          overflowX="auto"
          overflowY="hidden"
          scrollSnapType="x mandatory"
          w="full"
          whiteSpace="nowrap"
          {...rest}
        >
          {colors.map(({ name, hex }, index) => (
            <Box
              key={`${hex}-${index}`}
              as="li"
              flexBasis="$slideSize"
              flexGrow={0}
              flexShrink={0}
              listStyle="none"
              scrollSnapAlign="start"
            >
              <ColorCard name={size === "md" ? name : undefined} hex={hex} />
            </Box>
          ))}
        </GridItem>

        <GridItem
          alignSelf="center"
          gridColumn="1"
          gridRow="1"
          ps="$slideGap"
          zIndex="1"
        >
          <CategoryCarouselButton
            size={size}
            placement="left"
            onClick={() => onScrollMove("left")}
          />
        </GridItem>

        <GridItem
          alignSelf="center"
          gridColumn="3"
          gridRow="1"
          pe="$slideGap"
          zIndex="1"
        >
          <CategoryCarouselButton
            size={size}
            placement="right"
            onClick={() => onScrollMove("right")}
          />
        </GridItem>
      </Grid>
    )
  },
)

CategoryCarousel.displayName = "CategoryCarousel"

interface CategoryCarouselButtonProps extends Omit<IconButtonProps, "size"> {
  placement: "left" | "right"
  size?: CategorySize
}

const CategoryCarouselButton: FC<CategoryCarouselButtonProps> = memo(
  ({ size, placement, ...rest }) => {
    return (
      <IconButton
        bg={["whiteAlpha.400", "blackAlpha.500"]}
        h={size === "md" ? "10" : "8"}
        icon={
          <ChevronIcon
            color={["blackAlpha.700", "whiteAlpha.800"]}
            fontSize={size === "md" ? "2xl" : "lg"}
            transform={
              placement === "left" ? "rotate(90deg)" : "rotate(-90deg)"
            }
          />
        }
        isRounded
        lineHeight="1"
        minW="auto"
        w={size === "md" ? "10" : "8"}
        _hover={{ bg: ["whiteAlpha.500", "blackAlpha.600"] }}
        {...rest}
      />
    )
  },
)

CategoryCarouselButton.displayName = "CategoryCarouselButton"
