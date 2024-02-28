import {
  Button,
  Center,
  ColorPicker,
  ColorSwatch,
  HStack,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  assignRef,
  forwardRef,
  useClipboard,
  useDisclosure,
  useNotice,
} from "@yamada-ui/react"
import type { CenterProps, StackProps } from "@yamada-ui/react"
import { memo, useRef, useState } from "react"
import type { FC, MutableRefObject } from "react"
import { useHexes } from "./context"
import type { OrderColor } from "./index.page"
import { Clipboard, Clone, Pen, Trash } from "components/media-and-icons"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { f, isLight } from "utils/color"

export type HexControlButtonsProps = StackProps & OrderColor & {}

export const HexControlButtons: FC<HexControlButtonsProps> = memo(
  ({ id, name, hex, ...rest }) => {
    const { onClone, onDelete } = useHexes()

    return (
      <HStack
        gap="sm"
        transitionProperty="common"
        transitionDuration="slower"
        {...rest}
      >
        <EditButton id={id} name={name} hex={hex} />

        <HexControlButton hex={hex} onClick={() => onClone({ id, name, hex })}>
          <Clone fontSize="1.45em" />
        </HexControlButton>

        <CopyButton hex={hex} />

        <HexControlButton hex={hex} onClick={() => onDelete(id)}>
          <Trash />
        </HexControlButton>
      </HStack>
    )
  },
)

HexControlButtons.displayName = "HexControlButtons"

type HexControlButtonProps = CenterProps & Pick<Color, "hex">

const HexControlButton = memo(
  forwardRef<HexControlButtonProps, "button">(({ hex, ...rest }, ref) => {
    return (
      <Center
        ref={ref}
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
  }),
)

HexControlButton.displayName = "HexControlButton"

type EditInputProps = Pick<Color, "name"> & {
  nameRef: MutableRefObject<() => string>
}

const EditInput: FC<EditInputProps> = memo(({ name, nameRef }) => {
  const [value, setValue] = useState<string>(name)

  assignRef(nameRef, () => value)

  return <Input value={value} onChange={(ev) => setValue(ev.target.value)} />
})

EditInput.displayName = "EditInput"

type EditColorPickerProps = Pick<Color, "hex"> & {
  hexRef: MutableRefObject<() => string>
}

const EditColorPicker: FC<EditColorPickerProps> = memo(({ hex, hexRef }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = useState<string>(hex)
  const { format } = useApp()
  const { t } = useI18n()

  assignRef(hexRef, () => value)

  return (
    <ColorPicker
      matchWidth
      placeholder={f("#ffffff", format)}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      value={value}
      onChange={setValue}
      format={format}
      onKeyDown={(ev) => {
        if (ev.key !== "Enter") return

        onClose()
      }}
    >
      <Button
        colorScheme="neutral"
        borderColor="transparent"
        bg={["blackAlpha.200", "whiteAlpha.100"]}
        onClick={onClose}
      >
        {t("palette.edit.submit")}
      </Button>
    </ColorPicker>
  )
})

EditColorPicker.displayName = "EditColorPicker"

type EditButtonProps = OrderColor

const EditButton: FC<EditButtonProps> = memo(({ id, name, hex }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onEdit } = useHexes()
  const { t } = useI18n()
  const nameRef = useRef<() => string>(() => name)
  const hexRef = useRef<() => string>(() => hex)

  const onSubmit = () => {
    const name = nameRef.current()
    const hex = hexRef.current()

    onEdit({ id, name, hex })

    onClose()
  }

  return (
    <Popover isOpen={isOpen} onClose={onClose} closeOnButton={false}>
      <PopoverTrigger>
        <HexControlButton hex={hex} onClick={onOpen}>
          <Pen />
        </HexControlButton>
      </PopoverTrigger>

      <PopoverContent>
        <PopoverBody>
          <EditInput name={name} nameRef={nameRef} />

          <EditColorPicker hex={hex} hexRef={hexRef} />

          <Button
            w="full"
            colorScheme="neutral"
            borderColor="transparent"
            bg={["blackAlpha.200", "whiteAlpha.100"]}
            onClick={onSubmit}
          >
            {t("palette.edit.submit")}
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
})

EditButton.displayName = "EditButton"

type CopyButtonProps = Pick<Color, "hex">

const CopyButton: FC<CopyButtonProps> = memo(({ hex }) => {
  const notice = useNotice({ limit: 1, placement: "bottom" })
  const { onCopy } = useClipboard(hex, 5000)

  return (
    <HexControlButton
      hex={hex}
      onClick={() => {
        onCopy()

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
      }}
    >
      <Clipboard />
    </HexControlButton>
  )
})

CopyButton.displayName = "CopyButton"
