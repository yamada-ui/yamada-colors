import { Check, X } from "@yamada-ui/lucide"
import type { ColorMode } from "@yamada-ui/react"
import {
  Center,
  Grid,
  Spacer,
  Text,
  VStack,
  Wrap,
  GridItem,
  Tag,
  Box,
} from "@yamada-ui/react"
import { useState, type FC, type MutableRefObject } from "react"
import type { ContrastCheckerProps } from "./contrast-checker"
import type { ContrastLevel } from "./index.page"

export type ContrastScoreProps = ColorContrastScore &
  Pick<ContrastCheckerProps, "mode" | "level"> & {
    setLevelRef: MutableRefObject<
      Map<ColorMode, (level: ContrastLevel) => void>
    >
  }

export const ContrastScore: FC<ContrastScoreProps> = ({
  mode,
  score,
  aa,
  aaa,
  level: levelProp,
  setLevelRef,
}) => {
  const [level, setLevel] = useState<ContrastLevel>(levelProp)

  setLevelRef.current.set(mode, setLevel)

  return (
    <VStack
      p={{ base: "lg", sm: "md" }}
      gap="sm"
      bg={["blackAlpha.50", "whiteAlpha.100"]}
      color="muted"
    >
      <Wrap alignItems="flex-start" gap="md">
        <Text
          color={["black", "white"]}
          fontSize={{ base: "6xl", sm: "5xl" }}
          fontWeight="bold"
          lineHeight={1}
        >
          {score.toFixed(1)}
        </Text>

        <Spacer />

        <Wrap gapX="lg" gapY="md" alignItems="flex-start">
          {level.aa ? (
            <ContrastLevelScore
              isMulti={level.aa && level.aaa}
              label="aa"
              {...aa}
            />
          ) : null}

          {level.aaa ? (
            <ContrastLevelScore
              isMulti={level.aa && level.aaa}
              label="aaa"
              {...aaa}
            />
          ) : null}
        </Wrap>
      </Wrap>
    </VStack>
  )
}

type ContrastLevelScoreProps = ColorContrastLevelScore & {
  label: ColorContrastLevel
  isMulti?: boolean
}

const ContrastLevelScore: FC<ContrastLevelScoreProps> = ({
  label,
  large,
  small,
  component,
  isMulti,
}) => {
  return (
    <Grid
      templateColumns="13ch auto 4ch"
      alignItems="center"
      gapX="sm"
      gapY={{ base: "sm", sm: "xs" }}
    >
      {isMulti ? (
        <GridItem as={Center} justifySelf="flex-start" colSpan={3}>
          <Tag size="sm" variant="muted">
            {label.toLocaleUpperCase()}
          </Tag>
        </GridItem>
      ) : null}

      <>
        <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
          Large Text
        </Text>

        {large ? (
          <Box color="success">
            <Check fontSize="1.5rem" />
          </Box>
        ) : (
          <Box color="danger">
            <X fontSize="1.5rem" />
          </Box>
        )}

        <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
          {large ? "Pass" : "Fail"}
        </Text>

        <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
          Small Text
        </Text>

        {small ? (
          <Box color="success">
            <Check fontSize="1.5rem" />
          </Box>
        ) : (
          <Box color="danger">
            <X fontSize="1.5rem" />
          </Box>
        )}

        <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
          {small ? "Pass" : "Fail"}
        </Text>

        <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
          UI Component
        </Text>

        {component ? (
          <Box color="success">
            <Check fontSize="1.5rem" />
          </Box>
        ) : (
          <Box color="danger">
            <X fontSize="1.5rem" />
          </Box>
        )}

        <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
          {component ? "Pass" : "Fail"}
        </Text>
      </>
    </Grid>
  )
}
