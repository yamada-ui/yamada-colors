import type { ButtonProps } from "@yamada-ui/react"
import { Button, HStack, useColorModeValue } from "@yamada-ui/react"
import type { Dispatch, SetStateAction, FC } from "react"
import { Pass } from "components/media-and-icons"
import { CONSTANT } from "constant"
import { setCookie } from "utils/storage"

export type LevelProps = {
  aa: boolean
  aaa: boolean
  setLevel: Dispatch<SetStateAction<{ aa: boolean; aaa: boolean }>>
}

export const Level: FC<LevelProps> = ({ aa, aaa, setLevel }) => {
  return (
    <HStack alignSelf="flex-end" gap="sm">
      <LevelButton
        isSelected={aa}
        pointerEvents={aa && !aaa ? "none" : "auto"}
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
      leftIcon={<Pass />}
      gap="1"
      variant={isSelected ? "solid" : "outline"}
      colorScheme={isSelected ? "success" : colorScheme}
      color={isSelected ? undefined : "muted"}
      border="1px solid"
      borderColor={isSelected ? "success.500" : "border"}
      rounded="full"
      {...rest}
    />
  )
}
