import type { CenterProps, ColorMode } from "@yamada-ui/react"
import type { FC, MutableRefObject } from "react"
import type { ContrastLevel } from "./index.page"
import { RefreshCcw } from "@yamada-ui/lucide"
import {
  Center,
  getMemoizedObject as get,
  IconButton,
  Text,
  Tooltip,
  useTheme,
  VStack,
  Wrap,
} from "@yamada-ui/react"
import { useI18n } from "contexts/i18n-context"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { isLight } from "utils/color"
import { ContrastScore } from "./contrast-score"
import { ContrastSearch } from "./contrast-search"
import { getContrast } from "./index.page"

export interface ContrastCheckerProps {
  contrast: ColorContrast
  level: ContrastLevel
  mode: ColorMode
  queriesRef: MutableRefObject<URLSearchParams>
  setLevelRef: MutableRefObject<Map<ColorMode, (level: ContrastLevel) => void>>
}

export const ContrastChecker: FC<ContrastCheckerProps> = ({
  contrast,
  level,
  mode,
  queriesRef,
  setLevelRef,
}) => {
  const router = useRouter()
  const [{ aa, aaa, bg, fg, score }, setContrast] =
    useState<ColorContrast>(contrast)

  const onChange = useCallback(
    (ground: ColorContrastGround, value: string) => {
      setContrast(({ bg, fg }) => {
        queriesRef.current.set(`${mode}.${ground}`, value.replace("#", ""))

        router.push(`/contrast-checker?${queriesRef.current}`, undefined, {
          shallow: true,
        })

        const isBg = ground === "bg"

        return getContrast(mode, isBg ? fg : value, isBg ? value : bg)
      })
    },
    [mode, queriesRef, router],
  )

  const onSwitch = useCallback(() => {
    setContrast(({ bg, fg }) => {
      queriesRef.current.set(`${mode}.fg`, bg.replace("#", ""))
      queriesRef.current.set(`${mode}.bg`, fg.replace("#", ""))

      router.push(`/contrast-checker?${queriesRef.current}`, undefined, {
        shallow: true,
      })

      return getContrast(mode, bg, fg)
    })
  }, [mode, queriesRef, router])

  return (
    <VStack as="section" gap={{ base: "normal", sm: "md" }}>
      <ContrastSearch bg={bg} fg={fg} onChange={onChange} />

      <VStack
        boxShadow={[
          "0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 -2px 4px 1px rgba(0, 0, 0, 0.06)",
          "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 5px 10px rgba(0, 0, 0, 0.2), 0px -5px 10px rgba(0, 0, 0, 0.2)",
        ]}
        gap="0"
        overflow="hidden"
        position="relative"
        rounded="2xl"
      >
        <SwitchButton bg={bg} onSwitch={onSwitch} />
        <ContrastPreview bg={bg} fg={fg} />
        <ContrastScore
          aa={aa}
          aaa={aaa}
          level={level}
          mode={mode}
          score={score}
          setLevelRef={setLevelRef}
        />
      </VStack>
    </VStack>
  )
}

interface ContrastPreviewProps extends ColorContrastSource {}

const ContrastPreview: FC<ContrastPreviewProps> = ({ bg, fg }) => {
  return (
    <VStack
      bg={bg}
      gap={{ base: "lg", sm: "normal" }}
      p={{ base: "lg", sm: "md" }}
    >
      <VStack gap={{ base: "sm", sm: "0" }}>
        <Text color={fg} fontSize="2xl" lineClamp={1}>
          Large Text
        </Text>

        <Text color={fg} lineClamp={1}>
          Small Text
        </Text>
      </VStack>

      <Wrap gap="md">
        <UIComponent bg={fg} color={bg} />

        <UIComponent borderColor={fg} borderWidth="1px" color={fg} />
      </Wrap>
    </VStack>
  )
}

interface UIComponentProps extends CenterProps {}

const UIComponent: FC<UIComponentProps> = ({ ...rest }) => {
  const { theme } = useTheme()

  return (
    <Center
      cursor="pointer"
      fontSize={{ base: "md", sm: "sm" }}
      h={{ base: "10", sm: "8" }}
      lineHeight={{ base: get(theme, "sizes.10"), sm: get(theme, "sizes.8") }}
      px={{ base: "4", sm: "3" }}
      rounded="full"
      {...rest}
    >
      <Text as="span">UI Component</Text>
    </Center>
  )
}

interface SwitchButtonProps extends Pick<ColorContrastSource, "bg"> {
  onSwitch: () => void
}

const SwitchButton: FC<SwitchButtonProps> = ({ bg, onSwitch }) => {
  const { t } = useI18n()

  return (
    <Tooltip label={t("contrast-checker.invert")} placement="top">
      <IconButton
        bg={isLight(bg) ? "blackAlpha.800" : "whiteAlpha.800"}
        border="none"
        color={isLight(bg) ? "white" : "black"}
        h={{ base: "8", sm: "6" }}
        icon={<RefreshCcw fontSize={{ base: "1rem", sm: "0.875rem" }} />}
        isRounded
        minW={{ base: "8", sm: "6" }}
        position="absolute"
        right={{ base: "md", sm: "md" }}
        top={{ base: "md", sm: "md" }}
        _hover={{
          bg: isLight(bg) ? "black" : "white",
        }}
        onClick={onSwitch}
      />
    </Tooltip>
  )
}
