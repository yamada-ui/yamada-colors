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
import { Check, Fail } from "components/media-and-icons"
import { NextLink } from "components/navigation"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { f, isLight } from "utils/color"

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
    light: ContrastData
    dark: ContrastData
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
          <Contrast hex={hex} mode="light" data={contrast.light} />

          <Contrast hex={hex} mode="dark" data={contrast.dark} />
        </Grid>

        <NextLink
          href={`/contrast-checker?light.fg=${hex.replace("#", "")}&dark.fg=${hex.replace("#", "")}`}
          variant="muted"
          fontSize="sm"
          whiteSpace="nowrap"
          alignSelf="flex-start"
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
      h={{ base: "xs", sm: "auto" }}
      templateColumns={{ base: "repeat(5, 1fr)", sm: "repeat(1, 1fr)" }}
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
      py={{ base: "md", sm: "md" }}
      px="md"
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
        fontSize={{ base: "md", sm: "sm" }}
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
  mode: "light" | "dark"
  data: ContrastData
}

const Contrast: FC<ContrastProps> = ({ hex, mode, data }) => {
  const { format } = useApp()
  const color = mode === "light" ? "black" : "white"
  const bg = mode === "light" ? "white" : "black"
  const muted = `${color}Alpha.700`

  return (
    <VStack
      rounded="2xl"
      p={{ base: "lg", sm: "md" }}
      borderWidth="1px"
      gap="sm"
      bg={bg}
      color={color}
    >
      <HStack gap="sm">
        <Box
          boxSize={{ base: "6", sm: "4" }}
          bg={hex}
          rounded={{ base: "lg", sm: "base" }}
        />

        <Text color={muted} fontSize={{ base: "md", sm: "sm" }}>
          {f(hex, format)}
        </Text>
      </HStack>

      <Wrap alignItems="center" gap="md">
        <Text fontSize={{ base: "6xl", sm: "5xl" }} fontWeight="bold">
          {data.score.toFixed(1)}
        </Text>

        <Spacer />

        <Grid
          templateColumns="auto auto auto"
          alignItems="center"
          gapX="sm"
          gapY={{ base: "sm", sm: "xs" }}
        >
          <Text
            minW="10ch"
            color={muted}
            fontSize={{ base: "md", sm: "sm" }}
            fontWeight="semibold"
          >
            Large Text
          </Text>

          {data.large ? <Check color="success" /> : <Fail color="danger" />}

          <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
            {data.large ? "Pass" : "Fail"}
          </Text>

          <Text
            color={muted}
            fontSize={{ base: "md", sm: "sm" }}
            fontWeight="semibold"
          >
            Small Text
          </Text>

          {data.small ? <Check color="success" /> : <Fail color="danger" />}

          <Text
            minW="4ch"
            fontSize={{ base: "md", sm: "sm" }}
            fontWeight="semibold"
          >
            {data.small ? "Pass" : "Fail"}
          </Text>
        </Grid>
      </Wrap>
    </VStack>
  )
}
