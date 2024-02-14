import {
  Box,
  Grid,
  GridItem,
  HStack,
  Heading,
  Spacer,
  Text,
  VStack,
  Wrap,
} from "@yamada-ui/react"
import type { FC } from "react"
import { Fail, Pass } from "components/media-and-icons"
import { NextLink } from "components/navigation"
import { useI18n } from "contexts/i18n-context"

type ContrastData = {
  score: number
  small: boolean
  large: boolean
}

export type A11yProps = {
  hex: string
  contrast: {
    white: ContrastData
    black: ContrastData
  }
}

export const A11y: FC<A11yProps> = ({ hex, contrast }) => {
  const { t } = useI18n()

  return (
    <Grid templateColumns={{ base: "repeat(2, 1fr)" }} gap="md">
      <GridItem as="section" display="flex" flexDirection="column" gap="md">
        <Heading fontSize={{ base: "lg" }}>
          {t("colors.color-blindness.title")}
        </Heading>
      </GridItem>

      <GridItem as="section" display="flex" flexDirection="column" gap="md">
        <Heading fontSize={{ base: "lg" }}>
          {t("colors.contrast.title")}
        </Heading>

        <Contrast hex={hex} type="white" data={contrast.white} />

        <Contrast hex={hex} type="black" data={contrast.black} />

        <NextLink
          href={`/contrast-checker?hex=${hex.replace("#", "")}`}
          variant="muted"
          fontSize="sm"
          whiteSpace="nowrap"
        >
          {t("colors.contrast.more")}
        </NextLink>
      </GridItem>
    </Grid>
  )
}

type ContrastProps = {
  hex: string
  type: "white" | "black"
  data: ContrastData
}

const Contrast: FC<ContrastProps> = ({ hex, type, data }) => {
  const color = type === "white" ? "black" : "white"
  const muted = `${color}Alpha.700`

  return (
    <VStack
      rounded="2xl"
      p="lg"
      borderWidth="1px"
      gap="sm"
      bg={type}
      color={color}
    >
      <HStack gap="sm">
        <Box boxSize={{ base: "8" }} bg={hex} rounded="lg" />

        <Text color={muted}>{hex}</Text>
      </HStack>

      <Wrap alignItems="center" gap="md">
        <Text fontSize="6xl" fontWeight="bold">
          {data.score.toFixed(1)}
        </Text>

        <Spacer />

        <Grid templateColumns="auto auto auto" alignItems="center" gap="sm">
          <Text minW="10ch" color={muted} fontSize="md" fontWeight="semibold">
            Large Text
          </Text>

          {data.large ? <Pass color="success" /> : <Fail color="danger" />}

          <Text fontSize="md" fontWeight="semibold">
            {data.large ? "Pass" : "Fail"}
          </Text>

          <Text color={muted} fontSize="md" fontWeight="semibold">
            Small Text
          </Text>

          {data.small ? <Pass color="success" /> : <Fail color="danger" />}

          <Text minW="4ch" fontSize="md" fontWeight="semibold">
            {data.small ? "Pass" : "Fail"}
          </Text>
        </Grid>
      </Wrap>
    </VStack>
  )
}
