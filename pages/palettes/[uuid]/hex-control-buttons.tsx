import {
  Box,
  Button,
  Center,
  ColorSelector,
  ColorSwatch,
  HStack,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  assignRef,
  convertColor,
  forwardRef,
  useClipboard,
  useDisclosure,
  useEyeDropper,
  useNotice,
} from "@yamada-ui/react"
import type {
  CenterProps,
  StackProps,
  UseDisclosureProps,
} from "@yamada-ui/react"
import { memo, useRef, useState } from "react"
import type { ChangeEvent, FC, MutableRefObject } from "react"
import { useHexes } from "./context"
import type { OrderColor } from "./index.page"
import {
  Clipboard,
  Clone,
  EyeDropper,
  Pen,
  Trash,
} from "components/media-and-icons"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { f, isLight } from "utils/color"

export type HexControlButtonsProps = StackProps &
  OrderColor & {
    isEditRef: MutableRefObject<boolean>
    onClose: () => void
  }

export const HexControlButtons: FC<HexControlButtonsProps> = memo(
  ({ id, name, hex, isEditRef, onClose, ...rest }) => {
    const { onClone, onDelete } = useHexes()

    return (
      <HStack
        gap="sm"
        transitionProperty="common"
        transitionDuration="slower"
        {...rest}
      >
        <EditButton
          id={id}
          name={name}
          hex={hex}
          onOpen={() => {
            isEditRef.current = true
          }}
          onClose={onClose}
        />

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

type EditColorPickerProps = Pick<Color, "hex"> & {
  hexRef: MutableRefObject<() => string>
}

const EditColorPicker: FC<EditColorPickerProps> = memo(({ hex, hexRef }) => {
  const { format } = useApp()
  const [inputValue, setInputValue] = useState<string>(f(hex, format))
  const [value, setValue] = useState<string>(hex)
  const { supported: eyeDropperSupported, onOpen: onEyeDropperOpen } =
    useEyeDropper()
  const isInputFocused = useRef<boolean>(false)

  const onInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value

    setInputValue(value)
    setValue(value)
  }

  const onChange = (value: string) => {
    setValue(value)

    setTimeout(() => {
      if (!isInputFocused.current) setInputValue(value)
    })
  }

  const onEyeDropperClick = async () => {
    try {
      const { sRGBHex } = (await onEyeDropperOpen()) ?? {}

      if (!sRGBHex) return

      setValue(sRGBHex)
    } catch {}
  }

  assignRef(hexRef, () => value)

  return (
    <>
      <Box position="relative" w="full">
        <ColorSwatch
          color={value}
          isRounded
          position="absolute"
          top="50%"
          transform="translateY(-50%)"
          zIndex={2}
          boxSize="6"
          insetStart="2"
        />

        <Input
          value={inputValue}
          onChange={onInputChange}
          onFocus={() => {
            isInputFocused.current = true
          }}
          onBlur={() => {
            isInputFocused.current = false
            const next = convertColor(value, "#ffffff")(format)

            setValue((prev) => (!next || prev === next ? prev : next))
            setInputValue(next ?? "")
          }}
          w="full"
          pl="10"
          pr="8"
          _focus={{ zIndex: "unset" }}
          placeholder={f("#ffffff", format)}
        />

        {eyeDropperSupported ? (
          <Box
            as="button"
            position="absolute"
            top="50%"
            transform="translateY(-50%)"
            display="inline-flex"
            justifyContent="center"
            alignItems="center"
            zIndex={1}
            insetEnd="2"
            w="6"
            py="1"
            fontSize="lg"
            outline={0}
            rounded="md"
            transitionProperty="common"
            transitionDuration="normal"
            pointerEvents="auto"
            color={["blackAlpha.600", "whiteAlpha.700"]}
            _hover={{
              color: ["blackAlpha.500", "whiteAlpha.600"],
            }}
            _focusVisible={{
              boxShadow: "outline",
            }}
            onClick={onEyeDropperClick}
          >
            <EyeDropper />
          </Box>
        ) : null}
      </Box>

      <ColorSelector
        value={value}
        onChange={onChange}
        format={format}
        withEyeDropper={false}
        withResult={false}
      />
    </>
  )
})

EditColorPicker.displayName = "EditColorPicker"

type EditButtonProps = OrderColor & UseDisclosureProps

const EditButton: FC<EditButtonProps> = memo(({ id, name, hex, ...rest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ ...rest })
  const [value, setValue] = useState<string>(name)
  const { onEdit } = useHexes()
  const { t } = useI18n()

  const hexRef = useRef<() => string>(() => hex)

  const onSubmit = () => {
    const hex = hexRef.current()

    onClose()

    onEdit({ id, name: value, hex })
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
          <Input value={value} onChange={(ev) => setValue(ev.target.value)} />

          <EditColorPicker hex={hex} hexRef={hexRef} />

          <Button
            isDisabled={!value.length}
            w="full"
            colorScheme="neutral"
            borderColor="transparent"
            bg={["blackAlpha.200", "whiteAlpha.100"]}
            onClick={onSubmit}
            _hover={{ _disabled: {} }}
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
