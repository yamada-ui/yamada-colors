import {
  AspectRatio,
  Box,
  Grid,
  GridItem,
  Heading,
  Motion,
  Text,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import type { FC, ReactNode } from "react"
import { NextLink } from "components/navigation"
import { useI18n } from "contexts/i18n-context"

export type OthersProps = {
  hex: string
  complementaryColors: string[]
  hueColors: string[]
  alternativeColors: string[]
  triadicColors: string[]
  squareColors: string[]
  splitComplementaryColors: string[]
}

export const Others: FC<OthersProps> = ({
  hex,
  complementaryColors,
  hueColors,
  alternativeColors,
  triadicColors,
  squareColors,
  splitComplementaryColors,
}) => {
  const { t } = useI18n()

  return (
    <Grid templateColumns={{ base: "repeat(3, 1fr)" }} gap="md">
      <List
        title={t("colors.complementary.title")}
        description={t("colors.complementary.description", hex)}
        colors={complementaryColors}
      />
      <List
        title={t("colors.alternative.title")}
        description={t("colors.alternative.description", hex)}
        more={t("colors.alternative.more")}
        href={`/generators?hex=${hex.replace("#", "")}&tab=alternative`}
        colors={alternativeColors}
      />
      <List
        title={t("colors.hues.title")}
        description={t("colors.hues.description", hex)}
        more={t("colors.hues.more")}
        href={`/generators?hex=${hex.replace("#", "")}&tab=hues`}
        colors={hueColors}
      />
      <List
        title={t("colors.triadic.title")}
        description={t("colors.triadic.description", hex)}
        colors={triadicColors}
      />
      <List
        title={t("colors.square.title")}
        description={t("colors.square.description", hex)}
        colors={squareColors}
      />
      <List
        title={t("colors.split-complementary.title")}
        description={t("colors.split-complementary.description", hex)}
        colors={splitComplementaryColors}
      />
    </Grid>
  )
}

type ListProps = {
  title: ReactNode
  description: ReactNode
  more?: ReactNode
  href?: string
  colors: string[]
}

const List: FC<ListProps> = ({ title, description, more, href, colors }) => {
  return (
    <GridItem as="section" display="flex" flexDirection="column" gap="md">
      <VStack gap={{ base: "xs", sm: "0" }}>
        <Heading fontSize={{ base: "lg" }}>{title}</Heading>

        <Text color="muted" fontSize="sm">
          {description}
        </Text>
      </VStack>

      <Box as="nav">
        <Grid
          as="ul"
          gap={{ base: "sm" }}
          templateColumns={{ base: "repeat(8, 1fr)" }}
        >
          {colors.map((hex, index) => (
            <Motion
              key={`${hex}-${index}`}
              as="li"
              whileHover={{ scale: 0.95 }}
            >
              <AspectRatio
                as={Link}
                href={`/colors/${hex.replace("#", "")}`}
                ratio={1}
              >
                <Box boxSize="full" bg={hex} rounded="md" />
              </AspectRatio>
            </Motion>
          ))}
        </Grid>
      </Box>

      {more && href ? (
        <NextLink href={href} variant="muted" fontSize="sm" whiteSpace="nowrap">
          {more}
        </NextLink>
      ) : null}
    </GridItem>
  )
}
