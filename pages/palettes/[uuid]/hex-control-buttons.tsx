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
  PopoverFooter,
  PopoverTrigger,
  Text,
  assignRef,
  convertColor,
  forwardRef,
  noop,
  useClipboard,
  useDisclosure,
  useEyeDropper,
  useNotice,
} from "@yamada-ui/react"
import type {
  CenterProps,
  ColorMode,
  InputProps,
  StackProps,
  UseDisclosureProps,
} from "@yamada-ui/react"
import Link from "next/link"
import { memo, useRef, useState } from "react"
import type { ChangeEvent, FC, MutableRefObject } from "react"
import { useHexes } from "./context"
import {
  Brush,
  Clipboard,
  Clone,
  Contrast,
  EyeDropper,
  Pen,
  Trash,
} from "components/media-and-icons"
import { RemoveScroll } from "components/other"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { f, isLight } from "utils/color"

export type HexControlButtonsProps = StackProps &
  ReorderColor & {
    colorMode: ColorMode
    isEditRef: MutableRefObject<boolean>
    onClose: () => void
  }

export const HexControlButtons: FC<HexControlButtonsProps> = memo(
  ({ id, name, hex, colorMode, isEditRef, onClose, ...rest }) => {
    const { onClone, onDelete } = useHexes()
    const resolvedHex = hex[colorMode === "light" ? 0 : 1]
    const [lightHex, darkHex] = hex

    return (
      <HStack gap="sm" {...rest}>
        <EditButton
          id={id}
          name={name}
          hex={hex}
          colorMode={colorMode}
          onOpen={() => {
            isEditRef.current = true
          }}
          onClose={() => {
            onClose()

            isEditRef.current = false
          }}
        />

        <HexControlButton
          as={Link}
          hex={resolvedHex}
          href={`/generators?hex=${resolvedHex.replace("#", "")}&tab=tones`}
          display={{ base: "flex", sm: "none" }}
        >
          <Brush />
        </HexControlButton>

        <HexControlButton
          as={Link}
          hex={resolvedHex}
          href={`/contrast-checker?light.fg=${lightHex.replace("#", "")}&dark.fg=${darkHex.replace("#", "")}`}
          display={{ base: "flex", sm: "none" }}
        >
          <Contrast />
        </HexControlButton>

        <HexControlButton
          hex={resolvedHex}
          onClick={() => onClone({ id, name, hex })}
        >
          <Clone fontSize="1.45em" />
        </HexControlButton>

        <CopyButton hex={resolvedHex} />

        <HexControlButton hex={resolvedHex} onClick={() => onDelete(id)}>
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
  resetRef: MutableRefObject<() => void>
} & Omit<InputProps, "value" | "defaultValue" | "onChange" | "size">

const EditColorPicker: FC<EditColorPickerProps> = memo(
  ({ hex, hexRef, resetRef, ...rest }) => {
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
        setInputValue(f(sRGBHex, format))
      } catch {}
    }

    assignRef(hexRef, () => value)
    assignRef(resetRef, () => {
      setInputValue(f(hex, format))
      setValue(hex)
    })

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
            {...rest}
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
  },
)

EditColorPicker.displayName = "EditColorPicker"

type EditButtonProps = ReorderColor &
  UseDisclosureProps & { colorMode: ColorMode }

const EditButton: FC<EditButtonProps> = memo(
  ({ id, name, hex, colorMode, ...rest }) => {
    const resolvedHex = hex[colorMode === "light" ? 0 : 1]
    const [lightHex, darkHex] = hex
    const resetRef = useRef<() => void>(noop)
    const hexRef = useRef<() => string>(() => resolvedHex)
    const isSubmitRef = useRef<boolean>(false)
    const { isOpen, onOpen, onClose } = useDisclosure({
      ...rest,
      onClose: () => {
        rest.onClose?.()

        if (!isSubmitRef.current) {
          resetRef.current()
          setValue(name)
        }

        isSubmitRef.current = false
      },
    })
    const [value, setValue] = useState<string>(name)
    const { onEdit } = useHexes()
    const { t } = useI18n()

    const onSubmit = () => {
      isSubmitRef.current = true

      const computedHex = f(hexRef.current(), "hex")

      const hex: [string, string] =
        colorMode === "light" ? [computedHex, darkHex] : [lightHex, computedHex]

      onEdit({ id, name: value, hex })

      onClose()
    }

    return (
      <Popover
        isOpen={isOpen}
        onClose={onClose}
        closeOnButton={false}
        restoreFocus={false}
        modifiers={[
          {
            name: "preventOverflow",
            options: {
              padding: {
                top: 16,
                bottom: 16,
                left: 16,
                right: 16,
              },
            },
          },
        ]}
      >
        <PopoverTrigger>
          <HexControlButton hex={resolvedHex} onClick={onOpen}>
            <Pen />
          </HexControlButton>
        </PopoverTrigger>

        <PopoverContent>
          <PopoverBody>
            <RemoveScroll allowPinchZoom={false} enabled={isOpen}>
              <>
                <Input
                  value={value}
                  onChange={(ev) => setValue(ev.target.value)}
                />

                <EditColorPicker
                  hex={resolvedHex}
                  resetRef={resetRef}
                  hexRef={hexRef}
                  onKeyDown={(ev) => {
                    if (ev.key !== "Enter") return

                    onSubmit()
                  }}
                />
              </>
            </RemoveScroll>
          </PopoverBody>

          <PopoverFooter>
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
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    )
  },
)

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
