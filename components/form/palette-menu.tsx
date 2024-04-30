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
  Text,
  Grid,
  GridItem,
  Box,
  VStack,
  useDisclosure,
  handlerAll,
  Input,
  assignRef,
  noop,
  Center,
  Motion,
  PopoverFooter,
  Tooltip,
} from "@yamada-ui/react"
import type { FC, MutableRefObject, RefObject } from "react"
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
      const firstRef = useRef<HTMLDivElement>(null)

      const onSelect = useCallback(
        ({ colors, ...rest }: ColorPalette) => {
          changePalette({
            colors: [...colors, { hex: [hex, hex], name }],
            ...rest,
          })

          onClose()
        },
        [onClose, changePalette, hex, name],
      )

      return (
        <Popover
          restoreFocus={false}
          placement="bottom-end"
          isOpen={isOpen}
          onClose={onClose}
          {...rest}
        >
          <PopoverTrigger>
            <Box>
              <Tooltip
                isDisabled={isOpen}
                label={t("component.palette-menu.tooltip")}
                placement="top"
              >
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
              </Tooltip>
            </Box>
          </PopoverTrigger>

          <PopoverContent w="sm">
            <PopoverCloseButton rounded="full" />

            <PopoverHeader>{t("component.palette-menu.title")}</PopoverHeader>

            <PopoverBody px="0">
              <RemoveScroll
                allowPinchZoom={false}
                enabled={!!isRemoveScroll && isOpen}
              >
                <VStack gap="0" h="sm" overflow="auto">
                  <PaletteButtons firstRef={firstRef} onSelect={onSelect} />
                </VStack>
              </RemoveScroll>
            </PopoverBody>

            <PopoverFooter>
              <CreatePalette firstRef={firstRef} onCloseRef={onCloseRef} />
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      )
    },
  ),
)

PaletteMenu.displayName = "PaletteMenu"

type PaletteButtonsProps = {
  firstRef: RefObject<HTMLDivElement>
  onSelect: (palette: ColorPalette) => void
}

const PaletteButtons: FC<PaletteButtonsProps> = memo(
  ({ firstRef, onSelect }) => {
    const { palettes } = useApp()
    const { t } = useI18n()

    return palettes.length ? (
      palettes.map((palette, index) => {
        const { uuid, name, colors } = palette
        const isFirst = !index

        return (
          <Grid
            key={uuid}
            ref={isFirst ? firstRef : undefined}
            as="button"
            w="full"
            px="sm"
            py="sm"
            display="grid"
            templateColumns={{ base: "auto 1fr" }}
            alignItems="center"
            outline={0}
            transitionProperty="common"
            transitionDuration="slower"
            _hover={{
              bg: ["blackAlpha.50", "whiteAlpha.50"],
            }}
            _focusVisible={{
              bg: ["blackAlpha.50", "whiteAlpha.50"],
            }}
            onClick={() => onSelect(palette)}
          >
            {colors.length ? (
              <Grid
                boxSize="10"
                rounded="md"
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
              <Box boxSize="10" rounded="md" bg={["#eeeeee", "#262626"]} />
            )}

            <VStack minW="0" gap="0" ps="sm">
              <Text
                as="span"
                fontWeight="semibold"
                lineHeight="6"
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
    ) : (
      <Center h="full" color="muted">
        {t("component.palette-menu.not-found")}
      </Center>
    )
  },
)

PaletteButtons.displayName = "PaletteButtons"

type CreatePaletteProps = {
  firstRef: RefObject<HTMLDivElement>
  onCloseRef: MutableRefObject<() => void>
}

const CreatePalette: FC<CreatePaletteProps> = memo(
  ({ firstRef, onCloseRef }) => {
    const { isOpen, onOpen, onClose } = useDisclosure({
      onOpen: () => {
        inputRef.current?.focus()
      },
      onClose: () => {
        setValue("")

        setTimeout(() => {
          firstRef.current?.focus()
        })
      },
    })
    const [value, setValue] = useState<string>("")
    const { t } = useI18n()
    const inputRef = useRef<HTMLInputElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const isComposition = useRef<boolean>(false)
    const { createPalette } = useApp()

    const onCreate = async () => {
      onClose()
      createPalette(value)
    }

    assignRef(onCloseRef, onClose)

    return (
      <VStack gap="0">
        <Motion
          initial={{ height: "0px", opacity: 0 }}
          animate={isOpen ? { height: "auto", opacity: 1 } : {}}
          overflow="hidden"
        >
          <Input
            ref={inputRef}
            value={value}
            onChange={(ev) => setValue(ev.target.value)}
            tabIndex={isOpen ? 0 : -1}
            mb="sm"
            _focusVisible={{
              zIndex: "yamcha",
              borderColor: ["focus", "focus"],
              boxShadow: `inset 0 0 0 1px var(--ui-colors-focus)`,
            }}
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
        </Motion>

        <Button
          ref={buttonRef}
          w="full"
          colorScheme="neutral"
          bg={["blackAlpha.200", "whiteAlpha.100"]}
          borderColor="transparent"
          leftIcon={<Plus />}
          disabled={isOpen && !value.length}
          onClick={!isOpen ? onOpen : onCreate}
          _hover={{ _disabled: {} }}
        >
          {t("component.palette-menu.create")}
        </Button>
      </VStack>
    )
  },
)

CreatePalette.displayName = "CreatePalette"
