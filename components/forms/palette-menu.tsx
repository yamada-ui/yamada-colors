import type { IconButtonProps, PopoverProps } from "@yamada-ui/react"
import type { FC, MutableRefObject, RefObject } from "react"
import { Palette, Plus } from "@yamada-ui/lucide"
import {
  assignRef,
  Box,
  Button,
  Center,
  forwardRef,
  Grid,
  GridItem,
  handlerAll,
  IconButton,
  Input,
  Motion,
  noop,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@yamada-ui/react"
import { RemoveScroll } from "components/other"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { memo, useCallback, useRef, useState } from "react"

export interface PaletteMenuProps extends PopoverProps {
  name: string
  hex: string
  isRemoveScroll?: boolean
  buttonProps?: IconButtonProps
}

export const PaletteMenu = memo(
  forwardRef<PaletteMenuProps, "button">(
    ({ name, hex, isRemoveScroll = true, buttonProps, ...rest }, ref) => {
      const onCloseRef = useRef<() => void>(noop)
      const { isOpen, onClose, onOpen } = useDisclosure({
        onClose: () => onCloseRef.current(),
      })
      const { t } = useI18n()
      const { changePalette } = useApp()
      const firstRef = useRef<HTMLButtonElement>(null)

      const onSelect = useCallback(
        ({ colors, ...rest }: ColorPalette) => {
          changePalette({
            colors: [...colors, { name, hex: [hex, hex] }],
            ...rest,
          })

          onClose()
        },
        [onClose, changePalette, hex, name],
      )

      return (
        <Popover
          isOpen={isOpen}
          placement="bottom-end"
          restoreFocus={false}
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
                  colorScheme="neutral"
                  bg={["blackAlpha.100", "whiteAlpha.100"]}
                  borderColor="transparent"
                  color="muted"
                  icon={<Palette fontSize="1.5rem" />}
                  isRounded
                  {...buttonProps}
                  onClick={handlerAll(buttonProps?.onClick, onOpen)}
                />
              </Tooltip>
            </Box>
          </PopoverTrigger>

          <PopoverContent maxW="sm" w="sm">
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

interface PaletteButtonsProps {
  firstRef: RefObject<HTMLButtonElement>
  onSelect: (palette: ColorPalette) => void
}

const PaletteButtons: FC<PaletteButtonsProps> = memo(
  ({ firstRef, onSelect }) => {
    const { palettes } = useApp()
    const { t } = useI18n()

    return palettes.length ? (
      palettes.map((palette, index) => {
        const { name, colors, uuid } = palette
        const isFirst = !index

        return (
          <Grid
            key={uuid}
            ref={isFirst ? firstRef : undefined}
            as="button"
            alignItems="center"
            display="grid"
            outline={0}
            px="sm"
            py="sm"
            templateColumns={{ base: "auto 1fr" }}
            transitionDuration="slower"
            transitionProperty="common"
            w="full"
            _focusVisible={{
              bg: ["blackAlpha.50", "whiteAlpha.50"],
            }}
            _hover={{
              bg: ["blackAlpha.50", "whiteAlpha.50"],
            }}
            onClick={() => onSelect(palette)}
          >
            {colors.length ? (
              <Grid
                boxSize="10"
                overflow="hidden"
                rounded="md"
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
              <Box bg={["#eeeeee", "#262626"]} boxSize="10" rounded="md" />
            )}

            <VStack gap="0" minW="0" ps="sm">
              <Text
                as="span"
                fontSize={{ base: "md", sm: "sm" }}
                fontWeight="semibold"
                lineClamp={1}
                lineHeight="6"
              >
                {name}
              </Text>

              <Text
                as="span"
                color="muted"
                fontSize="xs"
                lineClamp={1}
                lineHeight="4"
              >
                {colors.length} colors
              </Text>
            </VStack>
          </Grid>
        )
      })
    ) : (
      <Center color="muted" h="full">
        {t("component.palette-menu.not-found")}
      </Center>
    )
  },
)

PaletteButtons.displayName = "PaletteButtons"

interface CreatePaletteProps {
  firstRef: RefObject<HTMLButtonElement>
  onCloseRef: MutableRefObject<() => void>
}

const CreatePalette: FC<CreatePaletteProps> = memo(
  ({ firstRef, onCloseRef }) => {
    const { isOpen, onClose, onOpen } = useDisclosure({
      onClose: () => {
        setValue("")

        setTimeout(() => {
          firstRef.current?.focus()
        })
      },
      onOpen: () => {
        inputRef.current?.focus()
      },
    })
    const [value, setValue] = useState<string>("")
    const { t } = useI18n()
    const inputRef = useRef<HTMLInputElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const isComposition = useRef<boolean>(false)
    const { createPalette } = useApp()

    const onCreate = () => {
      onClose()
      createPalette(value)
    }

    assignRef(onCloseRef, onClose)

    return (
      <VStack gap="0">
        <Motion
          animate={isOpen ? { height: "auto", opacity: 1 } : {}}
          initial={{ height: "0px", opacity: 0 }}
          overflow="hidden"
        >
          <Input
            ref={inputRef}
            mb="sm"
            tabIndex={isOpen ? 0 : -1}
            value={value}
            _focusVisible={{
              borderColor: ["focus", "focus"],
              boxShadow: `inset 0 0 0 1px var(--ui-colors-focus)`,
              zIndex: "yamcha",
            }}
            onChange={(ev) => setValue(ev.target.value)}
            onCompositionEnd={() => {
              isComposition.current = false
            }}
            onCompositionStart={() => {
              isComposition.current = true
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
          colorScheme="neutral"
          bg={["blackAlpha.200", "whiteAlpha.100"]}
          borderColor="transparent"
          disabled={isOpen ? !value.length : undefined}
          leftIcon={<Plus fontSize="1.125rem" />}
          w="full"
          _hover={{ _disabled: {} }}
          onClick={!isOpen ? onOpen : onCreate}
        >
          {t("component.palette-menu.create")}
        </Button>
      </VStack>
    )
  },
)

CreatePalette.displayName = "CreatePalette"
