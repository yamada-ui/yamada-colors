import { Check } from "@yamada-ui/lucide"
import type { ButtonProps, ColorMode } from "@yamada-ui/react"
import {
  Box,
  Button,
  ChevronIcon,
  HStack,
  Spacer,
  Tooltip,
  useColorModeValue,
} from "@yamada-ui/react"
import { useState, type FC, type MutableRefObject } from "react"
import type { ContrastLevel } from "./index.page"
import { NextLinkIconButton } from "components/navigation"
import { CONSTANT } from "constant"
import { useI18n } from "contexts/i18n-context"
import { setCookie } from "utils/storage"

export type HeaderProps = {
  hexes: [string, string]
  level: ContrastLevel
  setLevelRef: MutableRefObject<Map<ColorMode, (level: ContrastLevel) => void>>
}

export const Header: FC<HeaderProps> = ({ hexes, level, setLevelRef }) => {
  const [{ aa, aaa }, setLevel] = useState(level)
  const { t } = useI18n()

  return (
    <HStack as="section" gap="sm">
      <Tooltip label={t("contrast-checker.back")} placement="top">
        <Box>
          <NextLinkIconButton
            href={`/colors/${hexes[0].replace("#", "")}`}
            bg={["blackAlpha.100", "whiteAlpha.100"]}
            borderColor="transparent"
            colorScheme="neutral"
            icon={
              <ChevronIcon
                color="muted"
                fontSize="1.5em"
                transform="rotate(90deg)"
              />
            }
            isRounded
          />
        </Box>
      </Tooltip>

      <Spacer />

      <LevelButton
        isSelected={aa}
        pointerEvents={aa && !aaa ? "none" : "auto"}
        tabIndex={aa && !aaa ? -1 : 0}
        onClick={() => {
          setLevel(({ aa, aaa }) => {
            const value = { aa: !aa, aaa }

            for (const func of setLevelRef.current.values()) {
              func(value)
            }
            setCookie(CONSTANT.STORAGE.LEVEL, JSON.stringify(value))

            return value
          })
        }}
      >
        AA
      </LevelButton>

      <LevelButton
        isSelected={aaa}
        pointerEvents={aaa && !aa ? "none" : "auto"}
        tabIndex={aaa && !aa ? -1 : 0}
        onClick={() => {
          setLevel(({ aa, aaa }) => {
            const value = { aa, aaa: !aaa }

            for (const func of setLevelRef.current.values()) {
              func(value)
            }
            setCookie(CONSTANT.STORAGE.LEVEL, JSON.stringify(value))

            return value
          })
        }}
      >
        AAA
      </LevelButton>
    </HStack>
  )
}

type LevelButtonProps = ButtonProps & { isSelected?: boolean }

const LevelButton: FC<LevelButtonProps> = ({ isSelected, ...rest }) => {
  const colorScheme = useColorModeValue("blackAlpha", "neutral")

  return (
    <Button
      size="sm"
      leftIcon={<Check fontSize="1.125rem" />}
      gap="1"
      variant={isSelected ? "solid" : "outline"}
      colorScheme={isSelected ? "success" : colorScheme}
      color={isSelected ? undefined : "muted"}
      border="1px solid"
      borderColor={isSelected ? ["success.500", "success.600"] : "border"}
      fontWeight="normal"
      isRounded
      _hover={isSelected ? {} : undefined}
      {...rest}
    />
  )
}
