import type { FC, ReactNode } from "react"
import { Box, Grid, GridItem, Heading, Text, VStack } from "@yamada-ui/react"
import { ColorCard } from "components/data-display"
import { Link } from "components/navigation"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { f } from "utils/color"

export interface GradientsProps {
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
      gapX="md"
      gapY="normal"
      templateColumns={{ base: "repeat(3, 1fr)", sm: "repeat(1, 1fr)" }}
    >
      <List
        href={`/generators?hex=${hex.replace("#", "")}&tab=shades`}
        colors={shadeColors}
        description={t("colors.shades.description", {
          base: f("#000000", format),
          label: f(hex, format),
        })}
        more={t("colors.shades.more")}
        title={t("colors.shades.title")}
      />
      <List
        href={`/generators?hex=${hex.replace("#", "")}&tab=tints`}
        colors={tintColors}
        description={t("colors.tints.description", {
          base: f("#ffffff", format),
          label: f(hex, format),
        })}
        more={t("colors.tints.more")}
        title={t("colors.tints.title")}
      />
      <List
        href={`/generators?hex=${hex.replace("#", "")}&tab=tones`}
        colors={toneColors}
        description={t("colors.tones.description", f(hex, format))}
        more={t("colors.tones.more")}
        title={t("colors.tones.title")}
      />
    </Grid>
  )
}

interface ListProps {
  colors: Colors
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
        <VStack as="ul">
          {colors.slice(0, 4).map(({ name, hex }, index) => (
            <ColorCard
              key={`${hex}-${index}`}
              name={name}
              size="md"
              hex={hex}
              motionProps={{ as: "li" }}
            />
          ))}
        </VStack>
      </Box>

      {more && href ? (
        <Link
          href={href}
          variant="muted"
          alignSelf="flex-start"
          fontSize="sm"
          prefetch
          whiteSpace="nowrap"
        >
          {more}
        </Link>
      ) : null}
    </GridItem>
  )
}
