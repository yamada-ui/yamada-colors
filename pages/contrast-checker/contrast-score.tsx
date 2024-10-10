import type { ColorMode } from "@yamada-ui/react"
import type { FC, MutableRefObject } from "react"
import type { ContrastCheckerProps } from "./contrast-checker"
import type { ContrastLevel } from "./index.page"
import { Check, X } from "@yamada-ui/lucide"
import {
  Box,
  Center,
  Grid,
  GridItem,
  Spacer,
  Tag,
  Text,
  VStack,
  Wrap,
} from "@yamada-ui/react"
import { useState } from "react"

export interface ContrastScoreProps
  extends ColorContrastScore,
    Pick<ContrastCheckerProps, "level" | "mode"> {
  setLevelRef: MutableRefObject<Map<ColorMode, (level: ContrastLevel) => void>>
}

export const ContrastScore: FC<ContrastScoreProps> = ({
  aa,
  aaa,
  level: levelProp,
  mode,
  score,
  setLevelRef,
}) => {
  const [level, setLevel] = useState<ContrastLevel>(levelProp)

  setLevelRef.current.set(mode, setLevel)

  return (
    <VStack
      bg={["blackAlpha.50", "whiteAlpha.100"]}
      color="muted"
      gap="sm"
      p={{ base: "lg", sm: "md" }}
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

        <Wrap alignItems="flex-start" gapX="lg" gapY="md">
          {level.aa ? (
            <ContrastLevelScore isMulti={level.aaa} label="aa" {...aa} />
          ) : null}

          {level.aaa ? (
            <ContrastLevelScore isMulti={level.aa} label="aaa" {...aaa} />
          ) : null}
        </Wrap>
      </Wrap>
    </VStack>
  )
}

interface ContrastLevelScoreProps extends ColorContrastLevelScore {
  label: ColorContrastLevel
  isMulti?: boolean
}

const ContrastLevelScore: FC<ContrastLevelScoreProps> = ({
  component,
  isMulti,
  label,
  large,
  small,
}) => {
  return (
    <Grid
      alignItems="center"
      gapX="sm"
      gapY={{ base: "sm", sm: "xs" }}
      templateColumns="13ch auto 4ch"
    >
      {isMulti ? (
        <GridItem as={Center} colSpan={3} justifySelf="flex-start">
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
