import type {
  CenterProps,
  ColorMode,
  StackProps,
  UseDisclosureProps,
} from "@yamada-ui/react"
import type { FC } from "react"
import {
  Clipboard,
  Contrast,
  Copy,
  Paintbrush,
  Pencil,
  Trash2,
} from "@yamada-ui/lucide"
import {
  Button,
  Center,
  ColorSwatch,
  forwardRef,
  HStack,
  noop,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Text,
  useClipboard,
  useDisclosure,
  useNotice,
  useUpdateEffect,
} from "@yamada-ui/react"
import { PaletteColorForm } from "components/forms"
import { RemoveScroll } from "components/other"
import { useI18n } from "contexts/i18n-context"
import Link from "next/link"
import { memo, useRef, useState } from "react"
import { isLight } from "utils/color"
import { useHexes } from "./context"

export interface HexControlButtonsProps
  extends ReorderColor,
    Omit<StackProps, "id"> {
  colorMode: ColorMode
  onEditClose?: () => void
  onEditOpen?: () => void
}

export const HexControlButtons: FC<HexControlButtonsProps> = memo(
  ({ id, name, colorMode, hex, onEditClose, onEditOpen, ...rest }) => {
    const { onClone, onDelete } = useHexes()
    const resolvedHex = hex[colorMode === "light" ? 0 : 1]
    const [lightHex, darkHex] = hex

    return (
      <HStack gap="sm" {...rest}>
        <EditButton
          id={id}
          name={name}
          colorMode={colorMode}
          hex={hex}
          onClose={onEditClose}
          onOpen={onEditOpen}
        />

        <HexControlButton
          as={Link}
          href={`/generators?hex=${resolvedHex.replace("#", "")}&tab=tones`}
          display={{ base: "flex", sm: "none" }}
          hex={resolvedHex}
        >
          <Paintbrush fontSize="1.125rem" />
        </HexControlButton>

        <HexControlButton
          as={Link}
          href={`/contrast-checker?light.fg=${lightHex.replace("#", "")}&dark.fg=${darkHex.replace("#", "")}`}
          display={{ base: "flex", sm: "none" }}
          hex={resolvedHex}
        >
          <Contrast fontSize="1.125rem" />
        </HexControlButton>

        <HexControlButton
          hex={resolvedHex}
          onClick={() => onClone({ id, name, hex })}
        >
          <Copy fontSize="1.125rem" />
        </HexControlButton>

        <CopyButton hex={resolvedHex} />

        <HexControlButton hex={resolvedHex} onClick={() => onDelete(id)}>
          <Trash2 fontSize="1.125rem" />
        </HexControlButton>
      </HStack>
    )
  },
)

HexControlButtons.displayName = "HexControlButtons"

interface HexControlButtonProps extends CenterProps, Pick<Color, "hex"> {}

const HexControlButton = memo(
  forwardRef<HexControlButtonProps, "button">(({ hex, ...rest }, ref) => {
    return (
      <Center
        ref={ref}
        as="button"
        color={isLight(hex) ? "blackAlpha.500" : "whiteAlpha.500"}
        cursor="pointer"
        outline={0}
        p="1"
        rounded="full"
        transitionDuration="slower"
        transitionProperty="common"
        _focusVisible={{ boxShadow: "outline" }}
        _hover={{ color: isLight(hex) ? "black" : "white" }}
        {...rest}
      />
    )
  }),
)

HexControlButton.displayName = "HexControlButton"

interface EditButtonProps extends ReorderColor, UseDisclosureProps {
  colorMode: ColorMode
}

const EditButton: FC<EditButtonProps> = memo(
  ({ id, name: nameProp, colorMode, hex, ...rest }) => {
    const [lightHex, darkHex] = hex
    const resolvedHex = colorMode === "light" ? lightHex : darkHex
    const isSubmitRef = useRef<boolean>(false)
    const resetRef = useRef<(value: string) => void>(noop)
    const { isOpen, onClose, onOpen } = useDisclosure({
      ...rest,
      onClose: () => {
        if (!isSubmitRef.current) {
          setName(nameProp)
          setColor(resolvedHex)
          resetRef.current(resolvedHex)
        }

        isSubmitRef.current = false
      },
    })
    const { onEdit } = useHexes()
    const { t } = useI18n()
    const [name, setName] = useState<string>(nameProp)
    const [color, setColor] = useState<string>(resolvedHex)

    const onSubmit = () => {
      isSubmitRef.current = true

      const hex: [string, string] =
        colorMode === "light" ? [color, darkHex] : [lightHex, color]

      onEdit({ id, name, hex })

      onClose()
    }

    useUpdateEffect(() => {
      setName(name)
    }, [name])

    useUpdateEffect(() => {
      setColor(resolvedHex)
    }, [resolvedHex])

    return (
      <Popover
        closeOnButton={false}
        isOpen={isOpen}
        modifiers={[
          {
            name: "preventOverflow",
            options: {
              padding: {
                bottom: 16,
                left: 16,
                right: 16,
                top: 16,
              },
            },
          },
        ]}
        restoreFocus={false}
        onClose={onClose}
      >
        <PopoverTrigger>
          <HexControlButton hex={resolvedHex} onClick={onOpen}>
            <Pencil fontSize="1.125rem" />
          </HexControlButton>
        </PopoverTrigger>

        <PopoverContent
          onAnimationComplete={() => {
            if (!isOpen) rest.onClose?.()
          }}
        >
          <PopoverBody>
            <RemoveScroll allowPinchZoom={false} enabled={isOpen}>
              <PaletteColorForm
                name={name}
                color={color}
                resetRef={resetRef}
                onChangeColor={setColor}
                onChangeName={setName}
                onSubmit={onSubmit}
              />
            </RemoveScroll>
          </PopoverBody>

          <PopoverFooter>
            <Button
              colorScheme="neutral"
              bg={["blackAlpha.200", "whiteAlpha.100"]}
              borderColor="transparent"
              isDisabled={!name.length}
              w="full"
              _hover={{ _disabled: {} }}
              onClick={onSubmit}
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

interface CopyButtonProps extends Pick<Color, "hex"> {}

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
                  boxShadow={["md", "dark-lg"]}
                  gap="sm"
                  pl="sm"
                  pr="normal"
                  py="sm"
                  rounded="full"
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
      <Clipboard fontSize="1.125rem" />
    </HexControlButton>
  )
})

CopyButton.displayName = "CopyButton"
