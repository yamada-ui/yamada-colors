import {
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

export type GradientProps = {
  hex: string
  shadeColors: Colors
  tintColors: Colors
  grayScaleColors: Colors
}

export const Gradient: FC<GradientProps> = ({
  hex,
  shadeColors,
  tintColors,
  grayScaleColors,
}) => {
  const { t } = useI18n()

  return (
    <Grid templateColumns={{ base: "repeat(3, 1fr)" }}>
      <List
        title={t("colors.shade.title")}
        description={t("colors.shade.description", hex)}
        more={t("colors.shade.more")}
        href={`/generators?hex=${hex.replace("#", "")}&tab=shade`}
        colors={shadeColors}
      />
      <List
        title={t("colors.tint.title")}
        description={t("colors.tint.description", hex)}
        more={t("colors.tint.more")}
        href={`/generators?hex=${hex.replace("#", "")}&tab=tint`}
        colors={tintColors}
      />
      <List
        title={t("colors.gray.title")}
        description={t("colors.gray.description", hex)}
        more={t("colors.gray.more")}
        href={`/generators?hex=${hex.replace("#", "")}&tab=gray`}
        colors={grayScaleColors}
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
        <Text color="muted" fontSize="sm">
          {description}
        </Text>
      </VStack>

      <Box as="nav">
        <VStack as="ul">
          {colors.slice(1, 5).map(({ name, hex }, index) => (
            <Motion
              key={`${hex}-${index}`}
              as="li"
              rounded="2xl"
              whileHover={{ scale: 0.95 }}
            >
              <Grid
                as={Link}
                href={`/colors/${hex.replace("#", "")}`}
                templateColumns={{ base: "auto 1fr" }}
                gap={{ base: "md" }}
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
          ))}
        </VStack>
      </Box>

      {more && href ? (
        <NextLink href={href} variant="muted" fontSize="sm" whiteSpace="nowrap">
          {more}
        </NextLink>
      ) : null}
    </GridItem>
  )
}
