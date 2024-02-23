import { Box, Grid, GridItem, Heading, Text, VStack } from "@yamada-ui/react"
import type { FC, ReactNode } from "react"
import { ColorCard } from "components/data-display"
import { NextLink } from "components/navigation"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { f } from "utils/color"

export type GradientsProps = {
  hex: string
  shadeColors: Colors
  tintColors: Colors
  toneColors: Colors
}

export const Gradients: FC<GradientsProps> = ({
  hex,
  shadeColors,
  tintColors,
  toneColors,
}) => {
  const { t } = useI18n()
  const { format } = useApp()

  return (
    <Grid
      templateColumns={{ base: "repeat(3, 1fr)", sm: "repeat(1, 1fr)" }}
      gapX="md"
      gapY="normal"
    >
      <List
        title={t("colors.shades.title")}
        description={t("colors.shades.description", {
          label: f(hex, format),
          base: f("#000000", format),
        })}
        more={t("colors.shades.more")}
        href={`/generators?hex=${hex.replace("#", "")}&tab=shades`}
        colors={shadeColors}
      />
      <List
        title={t("colors.tints.title")}
        description={t("colors.tints.description", {
          label: f(hex, format),
          base: f("#ffffff", format),
        })}
        more={t("colors.tints.more")}
        href={`/generators?hex=${hex.replace("#", "")}&tab=tints`}
        colors={tintColors}
      />
      <List
        title={t("colors.tones.title")}
        description={t("colors.tones.description", f(hex, format))}
        more={t("colors.tones.more")}
        href={`/generators?hex=${hex.replace("#", "")}&tab=tones`}
        colors={toneColors}
      />
    </Grid>
  )
}

type ListProps = {
  title: ReactNode
  description: ReactNode
  more?: ReactNode
  href?: string
  colors: Colors
}

const List: FC<ListProps> = ({ title, description, more, href, colors }) => {
  return (
    <GridItem as="section" display="flex" flexDirection="column" gap="md">
      <VStack gap={{ base: "xs", sm: "0" }}>
        <Heading fontSize={{ base: "lg" }}>{title}</Heading>

        <Text color="muted" fontSize="sm" lineClamp={1}>
          {description}
        </Text>
      </VStack>

      <Box as="nav">
        <VStack as="ul">
          {colors.slice(0, 4).map(({ name, hex }, index) => (
            <ColorCard
              size="md"
              key={`${hex}-${index}`}
              hex={hex}
              name={name}
              motionProps={{ as: "li" }}
            />
          ))}
        </VStack>
      </Box>

      {more && href ? (
        <NextLink
          href={href}
          variant="muted"
          fontSize="sm"
          whiteSpace="nowrap"
          alignSelf="flex-start"
        >
          {more}
        </NextLink>
      ) : null}
    </GridItem>
  )
}
