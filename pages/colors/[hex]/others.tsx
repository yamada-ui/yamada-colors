import type { FC, ReactNode } from "react"
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Motion,
  Text,
  VStack,
  Wrap,
} from "@yamada-ui/react"
import { NextLink } from "components/navigation"
import { ColorCommandMenu } from "components/overlay"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import Link from "next/link"
import { f } from "utils/color"

export interface OthersProps {
  alternativeColors: string[]
  complementaryColors: string[]
  hex: string
  hueColors: string[]
  splitComplementaryColors: string[]
  squareColors: string[]
  triadicColors: string[]
}

export const Others: FC<OthersProps> = ({
  alternativeColors,
  complementaryColors,
  hex,
  hueColors,
  splitComplementaryColors,
  squareColors,
  triadicColors,
}) => {
  const { t } = useI18n()
  const { format } = useApp()

  return (
    <Grid
      gap={{ base: "md", sm: "normal" }}
      templateColumns={{ base: "repeat(3, 1fr)", sm: "1fr" }}
    >
      <List
        colors={complementaryColors}
        description={t("colors.complementary.description")}
        title={t("colors.complementary.title")}
      />
      <List
        href={`/generators?hex=${hex.replace("#", "")}&tab=alternatives`}
        colors={alternativeColors}
        description={t("colors.alternatives.description", f(hex, format))}
        more={t("colors.alternatives.more")}
        title={t("colors.alternatives.title")}
      />
      <List
        href={`/generators?hex=${hex.replace("#", "")}&tab=hues`}
        colors={hueColors}
        description={t("colors.hues.description")}
        more={t("colors.hues.more")}
        title={t("colors.hues.title")}
      />
      <List
        colors={triadicColors}
        description={t("colors.triadic.description")}
        title={t("colors.triadic.title")}
      />
      <List
        colors={squareColors}
        description={t("colors.square.description")}
        title={t("colors.square.title")}
      />
      <List
        colors={splitComplementaryColors}
        description={t("colors.split-complementary.description")}
        title={t("colors.split-complementary.title")}
      />
    </Grid>
  )
}

interface ListProps {
  colors: string[]
  description: ReactNode
  title: ReactNode
  href?: string
  more?: ReactNode
}

const List: FC<ListProps> = ({ href, colors, description, more, title }) => {
  return (
    <GridItem as="section" display="flex" flexDirection="column" gap="md">
      <VStack gap={{ base: "xs", sm: "0" }}>
        <Heading fontSize={{ base: "lg" }}>{title}</Heading>

        <Text color="muted" fontSize="sm" lineClamp={1}>
          {description}
        </Text>
      </VStack>

      <Box as="nav">
        <Wrap as="ul" gap={{ base: "sm" }}>
          {colors.map((hex, index) => (
            <ColorCommandMenu key={`${hex}-${index}`} value={hex}>
              <Motion as="li" whileHover={{ scale: 0.95 }}>
                <Box
                  as={Link}
                  href={`/colors/${hex.replace("#", "")}`}
                  bg={hex}
                  boxSize={{ base: "8" }}
                  display="block"
                  outlineColor="focus"
                  rounded="lg"
                />
              </Motion>
            </ColorCommandMenu>
          ))}
        </Wrap>
      </Box>

      {more && href ? (
        <NextLink
          href={href}
          variant="muted"
          alignSelf="flex-start"
          fontSize="sm"
          whiteSpace="nowrap"
        >
          {more}
        </NextLink>
      ) : null}
    </GridItem>
  )
}
