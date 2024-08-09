import {
  Paintbrush,
  Pencil,
  Clipboard,
  Contrast,
  Trash2,
  Copy,
} from "@yamada-ui/lucide"
import {
  Button,
  Center,
  ColorSwatch,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Text,
  forwardRef,
  useClipboard,
  useDisclosure,
  useNotice,
  useUpdateEffect,
} from "@yamada-ui/react"
import type {
  CenterProps,
  ColorMode,
  StackProps,
  UseDisclosureProps,
} from "@yamada-ui/react"
import Link from "next/link"
import { memo, useRef, useState } from "react"
import type { FC, MutableRefObject } from "react"
import { useHexes } from "./context"
import { PaletteColorForm } from "components/form"
import { RemoveScroll } from "components/other"
import { useI18n } from "contexts/i18n-context"
import { isLight } from "utils/color"

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
          <Paintbrush fontSize="1.125rem" />
        </HexControlButton>

        <HexControlButton
          as={Link}
          hex={resolvedHex}
          href={`/contrast-checker?light.fg=${lightHex.replace("#", "")}&dark.fg=${darkHex.replace("#", "")}`}
          display={{ base: "flex", sm: "none" }}
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

type EditButtonProps = ReorderColor &
  UseDisclosureProps & { colorMode: ColorMode }

const EditButton: FC<EditButtonProps> = memo(
  ({ id, name: nameProp, hex, colorMode, ...rest }) => {
    const [lightHex, darkHex] = hex
    const resolvedHex = colorMode === "light" ? lightHex : darkHex
    const isSubmitRef = useRef<boolean>(false)
    const { isOpen, onOpen, onClose } = useDisclosure({
      ...rest,
      onClose: () => {
        rest.onClose?.()

        if (!isSubmitRef.current) {
          setName(nameProp)
          setColor(resolvedHex)
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
      setValue(name)
    }, [name])

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
            <Pencil fontSize="1.125rem" />
          </HexControlButton>
        </PopoverTrigger>

        <PopoverContent>
          <PopoverBody>
            <RemoveScroll allowPinchZoom={false} enabled={isOpen}>
              <PaletteColorForm
                name={name}
                onChangeName={setName}
                color={color}
                onChangeColor={setColor}
                onSubmit={onSubmit}
              />
            </RemoveScroll>
          </PopoverBody>

          <PopoverFooter>
            <Button
              isDisabled={!name.length}
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
      <Clipboard fontSize="1.125rem" />
    </HexControlButton>
  )
})

CopyButton.displayName = "CopyButton"
