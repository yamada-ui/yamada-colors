import type { ButtonProps, ColorMode } from "@yamada-ui/react"
import type { FC, MutableRefObject } from "react"
import type { ContrastLevel } from "./index.page"
import { Check } from "@yamada-ui/lucide"
import {
  Box,
  Button,
  ChevronIcon,
  HStack,
  Spacer,
  Tooltip,
  useColorModeValue,
} from "@yamada-ui/react"
import { NextLinkIconButton } from "components/navigation"
import { CONSTANT } from "constant"
import { useI18n } from "contexts/i18n-context"
import { useState } from "react"
import { setCookie } from "utils/storage"

export interface HeaderProps {
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
            colorScheme="neutral"
            bg={["blackAlpha.100", "whiteAlpha.100"]}
            borderColor="transparent"
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

interface LevelButtonProps extends ButtonProps {
  isSelected?: boolean
}

const LevelButton: FC<LevelButtonProps> = ({ isSelected, ...rest }) => {
  const colorScheme = useColorModeValue("blackAlpha", "neutral")

  return (
    <Button
      colorScheme={isSelected ? "success" : colorScheme}
      size="sm"
      variant={isSelected ? "solid" : "outline"}
      border="1px solid"
      borderColor={isSelected ? ["success.500", "success.600"] : "border"}
      color={isSelected ? undefined : "muted"}
      fontWeight="normal"
      gap="1"
      isRounded
      leftIcon={<Check fontSize="1.125rem" />}
      _hover={isSelected ? {} : undefined}
      {...rest}
    />
  )
}
