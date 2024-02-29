import type { IconButtonProps, PopoverProps } from "@yamada-ui/react"
import {
  Popover,
  forwardRef,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  IconButton,
  PopoverCloseButton,
  Button,
  Center,
  Text,
  Grid,
  GridItem,
  Box,
  VStack,
  useDisclosure,
  handlerAll,
  Collapse,
  Input,
  assignRef,
  noop,
  ScrollArea,
} from "@yamada-ui/react"
import type { FC, MutableRefObject } from "react"
import { memo, useCallback, useRef, useState } from "react"
import { ColorPalette, Plus } from "components/media-and-icons"
import { RemoveScroll } from "components/other"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"

export type PaletteMenuProps = PopoverProps & {
  hex: string
  name: string
  isRemoveScroll?: boolean
  buttonProps?: IconButtonProps
}

export const PaletteMenu = memo(
  forwardRef<PaletteMenuProps, "button">(
    ({ hex, name, buttonProps, isRemoveScroll = true, ...rest }, ref) => {
      const onCloseRef = useRef<() => void>(noop)
      const { isOpen, onOpen, onClose } = useDisclosure({
        onClose: () => onCloseRef.current(),
      })
      const { t } = useI18n()
      const { changePalette } = useApp()

      const onSelect = useCallback(
        ({ colors, ...rest }: ColorPalette) => {
          changePalette({
            colors: [...colors, { hex, name }],
            ...rest,
          })

          onClose()
        },
        [onClose, changePalette, hex, name],
      )

      return (
        <RemoveScroll
          allowPinchZoom={false}
          enabled={!!isRemoveScroll && isOpen}
        >
          <Popover
            placement="bottom-end"
            isOpen={isOpen}
            onClose={onClose}
            {...rest}
          >
            <PopoverTrigger>
              <IconButton
                ref={ref}
                icon={<ColorPalette color="muted" />}
                bg={["blackAlpha.100", "whiteAlpha.100"]}
                borderColor="transparent"
                colorScheme="neutral"
                isRounded
                {...buttonProps}
                onClick={handlerAll(buttonProps?.onClick, onOpen)}
              />
            </PopoverTrigger>

            <PopoverContent w="sm">
              <PopoverCloseButton rounded="full" />

              <PopoverHeader>{t("component.palette-menu.title")}</PopoverHeader>

              <PopoverBody>
                <ScrollArea type="never" maxH="sm">
                  <PaletteButtons onSelect={onSelect} />
                  <PaletteButtons onSelect={onSelect} />
                  <PaletteButtons onSelect={onSelect} />
                  <PaletteButtons onSelect={onSelect} />
                </ScrollArea>

                <CreatePalette onCloseRef={onCloseRef} />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </RemoveScroll>
      )
    },
  ),
)

PaletteMenu.displayName = "PaletteMenu"

type PaletteButtonsProps = {
  onSelect: (palette: ColorPalette) => void
}

const PaletteButtons: FC<PaletteButtonsProps> = memo(({ onSelect }) => {
  const { palettes } = useApp()
  const { t } = useI18n()

  if (!palettes.length)
    return <Center>{t("component.palette-menu.not-found")}</Center>

  return palettes.map((palette) => {
    const { uuid, name, colors } = palette

    return (
      <Grid
        as="button"
        w="full"
        h="10"
        key={uuid}
        templateColumns={{ base: "auto 1fr" }}
        alignItems="center"
        gap={{ base: "sm" }}
        rounded="md"
        outline={0}
        transitionProperty="common"
        transitionDuration="slower"
        _focusVisible={{ boxShadow: "outline" }}
        color="muted"
        _hover={{ color: ["black", "white"] }}
        onClick={() => onSelect(palette)}
      >
        {colors.length ? (
          <Grid
            boxSize="8"
            rounded="full"
            overflow="hidden"
            templateColumns={`repeat(${colors.length < 3 ? 1 : 2}, 1fr)`}
          >
            {colors.map(({ hex }, index) => (
              <GridItem
                key={index}
                bg={hex}
                colSpan={colors.length === 3 ? (!index ? 2 : 1) : 1}
                display={index < 4 ? "block" : "none"}
              />
            ))}
          </Grid>
        ) : (
          <Box
            boxSize="8"
            rounded="full"
            bg={["blackAlpha.50", "whiteAlpha.100"]}
          />
        )}

        <VStack minW="0" gap="0">
          <Text
            as="span"
            fontWeight="semibold"
            lineHeight="5"
            lineClamp={1}
            fontSize={{ base: "md", sm: "sm" }}
          >
            {name}
          </Text>

          <Text
            as="span"
            color="muted"
            fontSize="xs"
            lineHeight="4"
            lineClamp={1}
          >
            {colors.length} colors
          </Text>
        </VStack>
      </Grid>
    )
  })
})

PaletteButtons.displayName = "PaletteButtons"

type CreatePaletteProps = {
  onCloseRef: MutableRefObject<() => void>
}

const CreatePalette: FC<CreatePaletteProps> = memo(({ onCloseRef }) => {
  const { isOpen, onOpen, onClose } = useDisclosure({
    onOpen: () => {
      inputRef.current?.focus()
    },
    onClose: () => {
      buttonRef.current?.focus()
      setValue("")
    },
  })
  const [value, setValue] = useState<string>("")
  const { t } = useI18n()
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isComposition = useRef<boolean>(false)
  const { createPalette } = useApp()

  const onCreate = () => {
    createPalette(value)
    onClose()
  }

  assignRef(onCloseRef, onClose)

  return (
    <>
      <Collapse isOpen={isOpen} p="1px">
        <Input
          ref={inputRef}
          value={value}
          onChange={(ev) => setValue(ev.target.value)}
          onCompositionStart={() => {
            isComposition.current = true
          }}
          onCompositionEnd={() => {
            isComposition.current = false
          }}
          onKeyDown={(ev) => {
            if (ev.key !== "Enter") return
            if (isComposition.current) return
            if (!value.length) return

            ev.preventDefault()
            ev.stopPropagation()

            onCreate()
          }}
        />
      </Collapse>

      <Button
        ref={buttonRef}
        w="full"
        colorScheme="neutral"
        bg={["blackAlpha.200", "whiteAlpha.100"]}
        borderColor="transparent"
        leftIcon={<Plus />}
        isDisabled={isOpen && !value.length}
        onClick={!isOpen ? onOpen : onCreate}
        _hover={{ _disabled: {} }}
      >
        {t("component.palette-menu.create")}
      </Button>
    </>
  )
})

CreatePalette.displayName = "CreatePalette"
