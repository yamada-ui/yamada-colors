import type {
  CenterProps,
  DrawerProps,
  IconButtonProps,
  MenuProps,
  UseDisclosureReturn,
} from "@yamada-ui/react"
import {
  Box,
  Center,
  CloseButton,
  Collapse,
  Drawer,
  DrawerBody,
  DrawerHeader,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuOptionItem,
  Spacer,
  VStack,
  forwardRef,
  isString,
  mergeRefs,
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
import { SearchColor } from "components/form"
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

export type HeaderProps = CenterProps

export const Header = memo(
  forwardRef<HeaderProps, "div">(({ ...rest }, ref) => {
    const headerRef = useRef<HTMLHeadingElement>()
    const { scrollY } = useScroll()
    const [y, setY] = useState<number>(0)
    const menuControls = useDisclosure()
    const searchControls = useDisclosure()
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
          zIndex="jeice"
          {...rest}
        >
          <Center w="full" maxW="9xl" px={{ base: "lg", lg: "0" }}>
            <VStack
              w="full"
              gap="0"
              py="3"
              px={{ base: "lg", lg: "md" }}
              bg={["blackAlpha.50", "whiteAlpha.100"]}
              backdropFilter="auto"
              backdropSaturate="180%"
              backdropBlur="10px"
              transitionProperty="common"
              transitionDuration="slower"
              roundedBottom="2xl"
              shadow={isScroll ? ["base", "dark-sm"] : undefined}
            >
              <HStack gap={{ base: "md", sm: "sm" }}>
                <Center
                  as={Link}
                  href="/"
                  aria-label="Yamada UI"
                  _hover={{ opacity: 0.7 }}
                  transitionProperty="opacity"
                  transitionDuration="slower"
                  _focus={{ outline: "none" }}
                  _focusVisible={{ boxShadow: "outline" }}
                  rounded="md"
                  fontSize="xl"
                >
                  <Image
                    src="/logo-black.png"
                    alt="Yamada Colors"
                    w="auto"
                    h={{ base: "8", sm: "7" }}
                    _dark={{ display: "none" }}
                  />
                  <Image
                    src="/logo-white.png"
                    alt="Yamada Colors"
                    w="auto"
                    h={{ base: "8", sm: "7" }}
                    _light={{ display: "none" }}
                  />
                </Center>

                <Spacer />

                <>
                  <Search isScroll={isScroll} />

                  <IconButton
                    variant="ghost"
                    isRounded
                    aria-label="Open navigation menu"
                    display={{ base: "none", sm: "inline-flex" }}
                    color="muted"
                    onClick={searchControls.onToggle}
                    icon={<MagnifyingGlass />}
                  />
                </>

                <ButtonGroup {...menuControls} />
              </HStack>

              <Collapse isOpen={searchControls.isOpen}>
                <Box p="1">
                  <Search isScroll={isScroll} isMobile />
                </Box>
              </Collapse>
            </VStack>
          </Center>
        </Center>

        <MobileMenu {...menuControls} />
      </>
    )
  }),
)

const disableDefaultValue = (path: string) =>
  path === "/" || /^\/(history|categories|palettes)/.test(path)

type SearchProps = {
  isScroll: boolean
  isMobile?: boolean
}

const Search: FC<SearchProps> = memo(({ isScroll, isMobile }) => {
  const padding = useBreakpointValue({ base: 32, md: 16 })
  const router = useRouter()
  const { hex, format } = useApp()
  const [value, setValue] = useState<string | undefined>(() => {
    if (disableDefaultValue(router.asPath)) {
      return undefined
    } else {
      return f(isString(hex) ? hex : hex?.[0], format)
    }
  })

  useUpdateEffect(() => {
    if (disableDefaultValue(router.asPath)) return

    setValue(f(isString(hex) ? hex : hex[0], format))
  }, [hex])

  return (
    <SearchColor
      value={value}
      onChange={setValue}
      onSubmit={(value) => {
        router.push(`/colors/${value.replace("#", "")}`)
      }}
      maxW={!isMobile ? { base: "sm", md: "xs" } : "full"}
      matchWidth
      containerProps={{
        display: !isMobile
          ? { base: "block", sm: "none" }
          : { base: "none", sm: "block" },
        mt: isMobile ? "3" : "0",
      }}
      borderColor="transparent"
      _hover={{}}
      bg={
        isScroll
          ? ["whiteAlpha.600", "blackAlpha.500"]
          : ["whiteAlpha.900", "blackAlpha.600"]
      }
      backdropFilter="auto"
      backdropSaturate="180%"
      backdropBlur="10px"
      transitionProperty="common"
      transitionDuration="slower"
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
      strategy={isMobile ? "fixed" : "absolute"}
      isRemoveScroll={isMobile}
    />
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
          _hover={{ bg: [`blackAlpha.100`, `whiteAlpha.50`] }}
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
          _hover={{ bg: [`blackAlpha.100`, `whiteAlpha.50`] }}
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
            _hover={{ bg: [`blackAlpha.100`, `whiteAlpha.50`] }}
          />
        ) : (
          <CloseButton
            size="lg"
            isRounded
            aria-label="Close navigation menu"
            display={{ base: "none", lg: "inline-flex" }}
            color="muted"
            onClick={onClose}
            _hover={{ bg: [`blackAlpha.100`, `whiteAlpha.50`] }}
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
        _hover={{ bg: [`blackAlpha.100`, `whiteAlpha.50`] }}
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
          _hover={{ bg: [`blackAlpha.100`, `whiteAlpha.50`] }}
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
  const { format, changeFormat } = useApp()
  const padding = useBreakpointValue({ base: 32, md: 16 })

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
        _hover={{ bg: [`blackAlpha.100`, `whiteAlpha.50`] }}
        {...rest}
      />

      <MenuList>
        <MenuOptionGroup<ColorFormat>
          value={format}
          onChange={changeFormat}
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
      w="auto"
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
