import {
  Center,
  ColorSwatch,
  HStack,
  Text,
  noop,
  useClipboard,
  useNotice,
} from "@yamada-ui/react"
import type { CenterProps, StackProps } from "@yamada-ui/react"
import { memo } from "react"
import type { FC } from "react"
import { useHexes } from "./hexes"
import type { OrderColor } from "./index.page"
import { Clipboard, Clone, Pen, Trash } from "components/media-and-icons"
import { isLight } from "utils/color"

export type HexControlButtonsProps = StackProps & OrderColor & {}

export const HexControlButtons: FC<HexControlButtonsProps> = memo(
  ({ id, name, hex, ...rest }) => {
    const { onClone, onDelete } = useHexes()
    const notice = useNotice({ limit: 1, placement: "bottom" })
    const clipboard = useClipboard(hex, 5000)

    const onCopy = () => {
      clipboard.onCopy()

      notice({
        component: () => {
          return (
            <Center>
              <HStack
                bg={["white", "black"]}
                rounded="full"
                py="sm"
                pl="sm"
                pr="normal"
                gap="sm"
                boxShadow={["md", "dark-lg"]}
              >
                <ColorSwatch color={hex} isRounded />

                <Text as="span">{hex}</Text>

                <Text as="span" color="muted" fontSize="sm">
                  Copied
                </Text>
              </HStack>
            </Center>
          )
        },
      })
    }

    return (
      <HStack
        gap="sm"
        transitionProperty="common"
        transitionDuration="slower"
        {...rest}
      >
        <HexControlButton hex={hex} onClick={noop}>
          <Pen />
        </HexControlButton>

        <HexControlButton
          hex={hex}
          onClick={(ev) => {
            ev.preventDefault()
            ev.stopPropagation()

            onClone({ id, name, hex })
          }}
        >
          <Clone fontSize="1.45em" />
        </HexControlButton>

        <HexControlButton hex={hex} onClick={onCopy}>
          <Clipboard />
        </HexControlButton>

        <HexControlButton hex={hex} onClick={() => onDelete(id)}>
          <Trash />
        </HexControlButton>
      </HStack>
    )
  },
)

HexControlButtons.displayName = "HexControlButtons"

type HexControlButtonProps = CenterProps & Pick<Color, "hex">

const HexControlButton: FC<HexControlButtonProps> = memo(({ hex, ...rest }) => {
  return (
    <Center
      p="1"
      as="button"
      rounded="full"
      cursor="pointer"
      outline={0}
      color={isLight(hex) ? "blackAlpha.500" : "whiteAlpha.500"}
      transitionProperty="common"
      transitionDuration="slower"
      _hover={{ color: isLight(hex) ? "black" : "white" }}
      _focusVisible={{ boxShadow: "outline" }}
      {...rest}
    />
  )
})

HexControlButton.displayName = "HexControlButton"
