import type {
  CenterProps,
  ColorPickerProps,
  DrawerProps,
  IconButtonProps,
  MenuProps,
  UseDisclosureReturn,
} from "@yamada-ui/react"
import {
  Box,
  Center,
  CloseButton,
  ColorPicker,
  Drawer,
  DrawerBody,
  DrawerHeader,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuOptionItem,
  Spacer,
  Text,
  forwardRef,
  isString,
  mergeRefs,
  noop,
  useBreakpoint,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  useMotionValueEvent,
  useScroll,
  useUpdateEffect,
} from "@yamada-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import type { FC } from "react"
import { memo, useEffect, useRef, useState } from "react"
import {
  Color,
  Discord,
  Github,
  Hamburger,
  MagnifyingGlass,
  Moon,
  Sun,
  Translate,
} from "components/media-and-icons"
import { NextLinkIconButton, Tree } from "components/navigation"
import { CONSTANT } from "constant"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { f } from "utils/color"
import type { ColorFormat } from "utils/color"
import { getCookie, setCookie } from "utils/storage"

export type HeaderProps = CenterProps

export const Header = memo(
  forwardRef<HeaderProps, "div">(({ ...rest }, ref) => {
    const headerRef = useRef<HTMLHeadingElement>()
    const { scrollY } = useScroll()
    const [y, setY] = useState<number>(0)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { height = 0 } = headerRef.current?.getBoundingClientRect() ?? {}

    useMotionValueEvent(scrollY, "change", setY)

    const isScroll = y > height

    return (
      <>
        <Center
          ref={mergeRefs(ref, headerRef)}
          as="header"
          w="full"
          position="sticky"
          top="0"
          left="0"
          right="0"
          zIndex="guldo"
          {...rest}
        >
          <Center w="full" maxW="9xl" px={{ base: "lg", lg: "0" }}>
            <HStack
              w="full"
              py="3"
              px={{ base: "lg", lg: "md" }}
              gap={{ base: "md", sm: "sm" }}
              bg={["blackAlpha.50", "whiteAlpha.100"]}
              backdropFilter="auto"
              backdropSaturate="180%"
              backdropBlur="10px"
              transitionProperty="common"
              transitionDuration="slower"
              roundedBottom="2xl"
              shadow={isScroll ? ["base", "dark-sm"] : undefined}
            >
              <Box
                as={Link}
                href="/"
                aria-label="Yamada UI"
                _hover={{ opacity: 0.7 }}
                transitionProperty="opacity"
                transitionDuration="slower"
                _focus={{ outline: "none" }}
                _focusVisible={{ boxShadow: "outline" }}
                rounded="md"
              >
                <Text as="span" fontSize="xl" fontWeight="semibold">
                  Yamada Colors
                </Text>
              </Box>

              <Spacer />

              <Search isScroll={isScroll} />

              <ButtonGroup {...{ isOpen, onOpen }} />
            </HStack>
          </Center>
        </Center>

        <MobileMenu isOpen={isOpen} onClose={onClose} />
      </>
    )
  }),
)

const disableDefaultValue = (path: string) =>
  path === "/" || /^\/(history|categories|palettes)/.test(path)

type SearchProps = ColorPickerProps & {
  isScroll: boolean
}

const Search: FC<SearchProps> = memo(({ isScroll, ...rest }) => {
  const router = useRouter()
  const { hex, format } = useApp()
  const [value, setValue] = useState<string | undefined>(() => {
    if (disableDefaultValue(router.asPath)) {
      return undefined
    } else {
      return f(isString(hex) ? hex : hex[0], format)
    }
  })

  useUpdateEffect(() => {
    if (disableDefaultValue(router.asPath)) return

    setValue(f(isString(hex) ? hex : hex[0], format))
  }, [hex])

  return (
    <>
      <ColorPicker
        placeholder={f("#ffffff", format)}
        value={value}
        onChange={setValue}
        maxW={{ base: "sm", md: "xs" }}
        matchWidth
        colorSelectorSize="md"
        display={{ base: "block", sm: "none" }}
        borderColor="transparent"
        format={format}
        _hover={{}}
        bg={
          isScroll
            ? ["whiteAlpha.600", "blackAlpha.500"]
            : ["whiteAlpha.900", "blackAlpha.600"]
        }
        rounded="full"
        backdropFilter="auto"
        backdropSaturate="180%"
        backdropBlur="10px"
        transitionProperty="common"
        transitionDuration="slower"
        eyeDropperProps={{ rounded: "full" }}
        {...rest}
      />

      <IconButton
        variant="ghost"
        isRounded
        aria-label="Open navigation menu"
        display={{ base: "none", sm: "inline-flex" }}
        color="muted"
        onClick={noop}
        icon={<MagnifyingGlass />}
      />
    </>
  )
})

Search.displayName = "Search"

type ButtonGroupProps = Partial<UseDisclosureReturn> & {
  isMobile?: boolean
}

const ButtonGroup: FC<ButtonGroupProps> = memo(
  ({ isMobile, isOpen, onOpen, onClose }) => {
    return (
      <HStack gap="sm">
        <NextLinkIconButton
          href={CONSTANT.SNS.DISCORD}
          isExternal
          isRounded
          aria-label="GitHub repository"
          variant="ghost"
          display={{ base: "inline-flex", lg: !isMobile ? "none" : undefined }}
          color="muted"
          icon={<Discord />}
        />

        <NextLinkIconButton
          href={CONSTANT.SNS.GITHUB.YAMADA_COLORS}
          isExternal
          isRounded
          aria-label="Discord server"
          variant="ghost"
          display={{ base: "inline-flex", lg: !isMobile ? "none" : undefined }}
          color="muted"
          icon={<Github />}
        />

        <FormatButton />

        {CONSTANT.I18N.LOCALES.length > 1 ? (
          <I18nButton
            display={{
              base: "inline-flex",
              md: !isMobile ? "none" : undefined,
            }}
          />
        ) : null}

        <ColorModeButton
          display={{ base: "inline-flex", sm: !isMobile ? "none" : undefined }}
        />

        {!isOpen ? (
          <IconButton
            variant="ghost"
            isRounded
            aria-label="Open navigation menu"
            display={{ base: "none", lg: "inline-flex" }}
            color="muted"
            onClick={onOpen}
            icon={<Hamburger />}
          />
        ) : (
          <CloseButton
            size="lg"
            // TODO: Remove once updated
            rounded="full"
            aria-label="Close navigation menu"
            display={{ base: "none", lg: "inline-flex" }}
            color="muted"
            onClick={onClose}
          />
        )}
      </HStack>
    )
  },
)

ButtonGroup.displayName = "ButtonGroup"

type I18nButtonProps = IconButtonProps & {
  menuProps?: MenuProps
}

const I18nButton: FC<I18nButtonProps> = memo(({ menuProps, ...rest }) => {
  const padding = useBreakpointValue({ base: 32, md: 16 })
  const { locale, changeLocale } = useI18n()

  return (
    <Menu
      placement="bottom"
      modifiers={[
        {
          name: "preventOverflow",
          options: {
            padding: {
              top: padding,
              bottom: padding,
              left: padding,
              right: padding,
            },
          },
        },
      ]}
      restoreFocus={false}
      {...menuProps}
    >
      <MenuButton
        as={IconButton}
        aria-label="Open language switching menu"
        isRounded
        variant="ghost"
        color="muted"
        icon={<Translate />}
        {...rest}
      />

      <MenuList>
        <MenuOptionGroup<string>
          value={locale}
          onChange={changeLocale}
          type="radio"
        >
          {CONSTANT.I18N.LOCALES.map(({ label, value }) => (
            <MenuOptionItem key={value} value={value} closeOnSelect>
              {label}
            </MenuOptionItem>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
})

I18nButton.displayName = "I18nButton"

type ColorModeButtonProps = IconButtonProps & {
  menuProps?: MenuProps
}

const ColorModeButton: FC<ColorModeButtonProps> = memo(
  ({ menuProps, ...rest }) => {
    const padding = useBreakpointValue({ base: 32, md: 16 })
    const { colorMode, internalColorMode, changeColorMode } = useColorMode()

    return (
      <Menu
        placement="bottom"
        modifiers={[
          {
            name: "preventOverflow",
            options: {
              padding: {
                top: padding,
                bottom: padding,
                left: padding,
                right: padding,
              },
            },
          },
        ]}
        restoreFocus={false}
        {...menuProps}
      >
        <MenuButton
          as={IconButton}
          aria-label="Open color mode switching menu"
          isRounded
          variant="ghost"
          color="muted"
          icon={colorMode === "dark" ? <Sun /> : <Moon />}
          {...rest}
        />

        <MenuList>
          <MenuOptionGroup<string>
            value={internalColorMode}
            onChange={changeColorMode}
            type="radio"
          >
            <MenuOptionItem value="light" closeOnSelect>
              Light
            </MenuOptionItem>
            <MenuOptionItem value="dark" closeOnSelect>
              Dark
            </MenuOptionItem>
            <MenuOptionItem value="system" closeOnSelect>
              System
            </MenuOptionItem>
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    )
  },
)

ColorModeButton.displayName = "ColorModeButton"

type FormatButtonProps = IconButtonProps & {
  menuProps?: MenuProps
}

const FormatButton: FC<FormatButtonProps> = memo(({ menuProps, ...rest }) => {
  const { format: formatProp } = useApp()
  const [format, setFormat] = useState<ColorFormat>(formatProp)
  const padding = useBreakpointValue({ base: 32, md: 16 })
  const router = useRouter()

  const onChange = (value: ColorFormat) => {
    setFormat(value)
    setCookie(CONSTANT.STORAGE.FORMAT, value)
    router.replace(router.asPath)
  }

  useEffect(() => {
    const clientFormat = getCookie(
      document.cookie,
      CONSTANT.STORAGE.FORMAT,
      "hex",
    )

    if (format !== clientFormat) setFormat(clientFormat)
  }, [format])

  return (
    <Menu
      placement="bottom"
      modifiers={[
        {
          name: "preventOverflow",
          options: {
            padding: {
              top: padding,
              bottom: padding,
              left: padding,
              right: padding,
            },
          },
        },
      ]}
      restoreFocus={false}
      {...menuProps}
    >
      <MenuButton
        as={IconButton}
        aria-label="Open color mode switching menu"
        isRounded
        variant="ghost"
        color="muted"
        icon={<Color />}
        {...rest}
      />

      <MenuList>
        <MenuOptionGroup<ColorFormat>
          value={format}
          onChange={onChange}
          type="radio"
        >
          <MenuOptionItem value="hex" closeOnSelect>
            HEX
          </MenuOptionItem>
          <MenuOptionItem value="rgb" closeOnSelect>
            RGB
          </MenuOptionItem>
          <MenuOptionItem value="hsl" closeOnSelect>
            HSL
          </MenuOptionItem>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
})

FormatButton.displayName = "FormatButton"

type MobileMenuProps = DrawerProps

const MobileMenu: FC<MobileMenuProps> = memo(({ isOpen, onClose }) => {
  const { hex, format } = useApp()
  const { events } = useRouter()
  const breakpoint = useBreakpoint()

  useEffect(() => {
    if (!["lg", "md", "sm"].includes(breakpoint)) onClose()
  }, [breakpoint, onClose])

  useEffect(() => {
    events.on("routeChangeComplete", onClose)

    return () => {
      events.off("routeChangeComplete", onClose)
    }
  }, [events, onClose])

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      withCloseButton={false}
      isFullHeight
      roundedLeft="xl"
    >
      <DrawerHeader
        justifyContent="flex-end"
        pt="sm"
        fontSize="md"
        fontWeight="normal"
      >
        <ButtonGroup isMobile {...{ format, isOpen, onClose }} />
      </DrawerHeader>

      <DrawerBody my="md">
        <Tree hex={hex} />
      </DrawerBody>
    </Drawer>
  )
})

MobileMenu.displayName = "MobileMenu"
