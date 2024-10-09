import type { GridItemProps } from "@yamada-ui/react"
import type { FC } from "react"
import { Check, X } from "@yamada-ui/lucide"
import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spacer,
  Text,
  VStack,
  Wrap,
} from "@yamada-ui/react"
import { NextLink } from "components/navigation"
import { ColorCommandMenu } from "components/overlay"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { f, isLight } from "utils/color"

interface ContrastData {
  large: boolean
  score: number
  small: boolean
}

export interface A11yProps {
  blind: {
    achromatopsia: string
    deuteranopia: string
    original: string
    protanopia: string
    tritanopia: string
  }
  contrast: {
    light: ContrastData
    dark: ContrastData
  }
  hex: string
}

export const A11y: FC<A11yProps> = ({ blind, contrast, hex }) => {
  const { t } = useI18n()

  return (
    <>
      <VStack as="section">
        <Heading fontSize={{ base: "lg" }}>
          {t("colors.contrast.title")}
        </Heading>

        <Grid
          gap="md"
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(1, 1fr)" }}
        >
          <Contrast data={contrast.light} hex={hex} mode="light" />

          <Contrast data={contrast.dark} hex={hex} mode="dark" />
        </Grid>

        <NextLink
          href={`/contrast-checker?light.fg=${hex.replace("#", "")}&dark.fg=${hex.replace("#", "")}`}
          variant="muted"
          alignSelf="flex-start"
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

interface BlindnessProps {
  achromatopsia: string
  deuteranopia: string
  original: string
  protanopia: string
  tritanopia: string
}

const Blindness: FC<BlindnessProps> = ({
  achromatopsia,
  deuteranopia,
  original,
  protanopia,
  tritanopia,
}) => {
  const { t } = useI18n()

  return (
    <Grid
      h={{ base: "xs", sm: "auto" }}
      overflow="hidden"
      rounded="2xl"
      templateColumns={{ base: "repeat(5, 1fr)", sm: "repeat(1, 1fr)" }}
    >
      <BlindnessItem
        hex={original}
        label={t("colors.color-blindness.original")}
      />
      <BlindnessItem
        hex={protanopia}
        label={t("colors.color-blindness.protanopia")}
      />
      <BlindnessItem
        hex={deuteranopia}
        label={t("colors.color-blindness.deuteranopia")}
      />
      <BlindnessItem
        hex={tritanopia}
        label={t("colors.color-blindness.tritanopia")}
      />
      <BlindnessItem
        hex={achromatopsia}
        label={t("colors.color-blindness.achromatopsia")}
      />
    </Grid>
  )
}

interface BlindnessItemProps extends GridItemProps {
  hex: string
  label: string
}

const BlindnessItem: FC<BlindnessItemProps> = ({ hex, label, ...rest }) => {
  return (
    <GridItem boxSize="full" {...rest}>
      <ColorCommandMenu value={hex} triggerProps={{ h: "full" }}>
        <Center
          bg={hex}
          h="full"
          minW="0"
          px="md"
          py={{ base: "md", sm: "md" }}
          _hover={{
            "& > span": {
              color: isLight(hex) ? "blackAlpha.700" : "whiteAlpha.700",
            },
          }}
        >
          <Text
            as="span"
            color="transparent"
            fontSize={{ base: "md", sm: "sm" }}
            lineClamp={1}
            transitionDuration="slower"
            transitionProperty="common"
          >
            {label}
          </Text>
        </Center>
      </ColorCommandMenu>
    </GridItem>
  )
}

interface ContrastProps {
  data: ContrastData
  hex: string
  mode: "dark" | "light"
}

const Contrast: FC<ContrastProps> = ({ data, hex, mode }) => {
  const { format } = useApp()
  const color = mode === "light" ? "black" : "white"
  const bg = mode === "light" ? "white" : "black"
  const muted = `${color}Alpha.700`

  return (
    <VStack
      bg={bg}
      borderWidth="1px"
      color={color}
      gap="sm"
      p={{ base: "lg", sm: "md" }}
      rounded="2xl"
    >
      <HStack gap="sm">
        <Box
          bg={hex}
          boxSize={{ base: "6", sm: "4" }}
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
          alignItems="center"
          gapX="sm"
          gapY={{ base: "sm", sm: "xs" }}
          templateColumns="auto auto auto"
        >
          <Text
            color={muted}
            fontSize={{ base: "md", sm: "sm" }}
            fontWeight="semibold"
            minW="10ch"
          >
            Large Text
          </Text>

          {data.large ? (
            <Box color="success">
              <Check fontSize="1.5rem" />
            </Box>
          ) : (
            <Box color="danger">
              <X fontSize="1.5rem" />
            </Box>
          )}

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

          {data.small ? (
            <Box color="success">
              <Check fontSize="1.5rem" />
            </Box>
          ) : (
            <Box color="danger">
              <X fontSize="1.5rem" />
            </Box>
          )}

          <Text
            fontSize={{ base: "md", sm: "sm" }}
            fontWeight="semibold"
            minW="4ch"
          >
            {data.small ? "Pass" : "Fail"}
          </Text>
        </Grid>
      </Wrap>
    </VStack>
  )
}
