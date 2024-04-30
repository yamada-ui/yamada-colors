import type { ButtonProps } from "@yamada-ui/react"
import {
  Box,
  Button,
  ChevronIcon,
  HStack,
  Spacer,
  Tooltip,
  useColorModeValue,
} from "@yamada-ui/react"
import type { Dispatch, SetStateAction, FC } from "react"
import { Check } from "components/media-and-icons"
import { NextLinkIconButton } from "components/navigation"
import { CONSTANT } from "constant"
import { useI18n } from "contexts/i18n-context"
import { setCookie } from "utils/storage"

export type HeaderProps = {
  hexes: [string, string]
  aa: boolean
  aaa: boolean
  setLevel: Dispatch<SetStateAction<{ aa: boolean; aaa: boolean }>>
}

export const Header: FC<HeaderProps> = ({ hexes, aa, aaa, setLevel }) => {
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
      leftIcon={<Check fontSize="0.9em" />}
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
