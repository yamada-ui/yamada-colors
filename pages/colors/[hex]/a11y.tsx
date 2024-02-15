import type { GridItemProps } from "@yamada-ui/react"
import {
  Box,
  Center,
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
import { isLight } from "utils/color"

type ContrastData = {
  score: number
  small: boolean
  large: boolean
}

export type A11yProps = {
  hex: string
  blind: {
    original: string
    protanopia: string
    deuteranopia: string
    tritanopia: string
    achromatopsia: string
  }
  contrast: {
    white: ContrastData
    black: ContrastData
  }
}

export const A11y: FC<A11yProps> = ({ hex, blind, contrast }) => {
  const { t } = useI18n()

  return (
    <>
      <VStack as="section">
        <Heading fontSize={{ base: "lg" }}>
          {t("colors.contrast.title")}
        </Heading>

        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(1, 1fr)" }}
          gap="md"
        >
          <Contrast hex={hex} type="white" data={contrast.white} />

          <Contrast hex={hex} type="black" data={contrast.black} />
        </Grid>

        <NextLink
          href={`/contrast-checker?hex=${hex.replace("#", "")}`}
          variant="muted"
          fontSize="sm"
          whiteSpace="nowrap"
        >
          {t("colors.contrast.more")}
        </NextLink>
      </VStack>

      <VStack as="section">
        <Heading fontSize={{ base: "lg" }}>
          {t("colors.color-blindness.title")}
        </Heading>

        <Blindness {...blind} />
      </VStack>
    </>
  )
}

type BlindnessProps = {
  original: string
  protanopia: string
  deuteranopia: string
  tritanopia: string
  achromatopsia: string
}

const Blindness: FC<BlindnessProps> = ({
  original,
  protanopia,
  deuteranopia,
  tritanopia,
  achromatopsia,
}) => {
  const { t } = useI18n()

  return (
    <Grid
      h="xs"
      templateColumns={{ base: "repeat(5, 1fr)" }}
      rounded="2xl"
      overflow="hidden"
    >
      <BlindnessItem
        label={t("colors.color-blindness.original")}
        hex={original}
      />
      <BlindnessItem
        label={t("colors.color-blindness.protanopia")}
        hex={protanopia}
      />
      <BlindnessItem
        label={t("colors.color-blindness.deuteranopia")}
        hex={deuteranopia}
      />
      <BlindnessItem
        label={t("colors.color-blindness.tritanopia")}
        hex={tritanopia}
      />
      <BlindnessItem
        label={t("colors.color-blindness.achromatopsia")}
        hex={achromatopsia}
      />
    </Grid>
  )
}

type BlindnessItemProps = GridItemProps & { label: string; hex: string }

const BlindnessItem: FC<BlindnessItemProps> = ({ label, hex, ...rest }) => {
  return (
    <GridItem
      as={Center}
      minW="0"
      p="md"
      bg={hex}
      _hover={{
        "& > span": {
          color: isLight(hex) ? "blackAlpha.700" : "whiteAlpha.700",
        },
      }}
      {...rest}
    >
      <Text
        as="span"
        color="transparent"
        transitionProperty="common"
        transitionDuration="slower"
        lineClamp={1}
      >
        {label}
      </Text>
    </GridItem>
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
