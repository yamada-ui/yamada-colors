import { RefreshCcw } from "@yamada-ui/lucide"
import type { CenterProps, ColorMode } from "@yamada-ui/react"
import {
  Center,
  IconButton,
  Text,
  VStack,
  Wrap,
  useTheme,
  getMemoizedObject as get,
  Tooltip,
} from "@yamada-ui/react"
import { useRouter } from "next/router"
import type { MutableRefObject, FC } from "react"
import { useCallback, useState } from "react"
import { ContrastScore } from "./contrast-score"
import { ContrastSearch } from "./contrast-search"
import { getContrast } from "./index.page"
import type { ContrastLevel } from "./index.page"
import { useI18n } from "contexts/i18n-context"
import { isLight } from "utils/color"

export type ContrastCheckerProps = {
  mode: ColorMode
  contrast: ColorContrast
  level: ContrastLevel
  setLevelRef: MutableRefObject<Map<ColorMode, (level: ContrastLevel) => void>>
  queriesRef: MutableRefObject<URLSearchParams>
}

export const ContrastChecker: FC<ContrastCheckerProps> = ({
  mode,
  contrast,
  level,
  setLevelRef,
  queriesRef,
}) => {
  const router = useRouter()
  const [{ fg, bg, score, aa, aaa }, setContrast] =
    useState<ColorContrast>(contrast)

  const onChange = useCallback(
    (ground: ColorContrastGround, value: string) => {
      setContrast(({ fg, bg }) => {
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
    setContrast(({ fg, bg }) => {
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
      <ContrastSearch fg={fg} bg={bg} onChange={onChange} />

      <VStack
        gap="0"
        rounded="2xl"
        overflow="hidden"
        position="relative"
        boxShadow={[
          "0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 -2px 4px 1px rgba(0, 0, 0, 0.06)",
          "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 5px 10px rgba(0, 0, 0, 0.2), 0px -5px 10px rgba(0, 0, 0, 0.2)",
        ]}
      >
        <SwitchButton bg={bg} onSwitch={onSwitch} />
        <ContrastPreview fg={fg} bg={bg} />
        <ContrastScore
          mode={mode}
          score={score}
          aa={aa}
          aaa={aaa}
          level={level}
          setLevelRef={setLevelRef}
        />
      </VStack>
    </VStack>
  )
}

type ContrastPreviewProps = ColorContrastSource

const ContrastPreview: FC<ContrastPreviewProps> = ({ fg, bg }) => {
  return (
    <VStack
      p={{ base: "lg", sm: "md" }}
      bg={bg}
      gap={{ base: "lg", sm: "normal" }}
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
        <UIComponent color={bg} bg={fg} />

        <UIComponent color={fg} borderWidth="1px" borderColor={fg} />
      </Wrap>
    </VStack>
  )
}

type UIComponentProps = CenterProps

const UIComponent: FC<UIComponentProps> = ({ ...rest }) => {
  const { theme } = useTheme()

  return (
    <Center
      h={{ base: "10", sm: "8" }}
      fontSize={{ base: "md", sm: "sm" }}
      lineHeight={{ base: get(theme, "sizes.10"), sm: get(theme, "sizes.8") }}
      px={{ base: "4", sm: "3" }}
      rounded="full"
      cursor="pointer"
      {...rest}
    >
      <Text as="span">UI Component</Text>
    </Center>
  )
}

type SwitchButtonProps = Pick<ColorContrastSource, "bg"> & {
  onSwitch: () => void
}

const SwitchButton: FC<SwitchButtonProps> = ({ bg, onSwitch }) => {
  const { t } = useI18n()

  return (
    <Tooltip label={t("contrast-checker.invert")} placement="top">
      <IconButton
        icon={<RefreshCcw fontSize={{ base: "1.125rem", sm: "0.875rem" }} />}
        border="none"
        minW={{ base: "8", sm: "6" }}
        h={{ base: "8", sm: "6" }}
        position="absolute"
        isRounded
        color={isLight(bg) ? "white" : "black"}
        bg={isLight(bg) ? "blackAlpha.800" : "whiteAlpha.800"}
        _hover={{
          bg: isLight(bg) ? "black" : "white",
        }}
        top={{ base: "md", sm: "md" }}
        right={{ base: "md", sm: "md" }}
        onClick={onSwitch}
      />
    </Tooltip>
  )
}
